<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Enums\SaleStatus;
use App\Enums\SettlementStatus;
use App\Enums\StockMovementType;
use App\Events\SaleCompleted;
use App\Jobs\CheckLowStockJob;
use App\Jobs\GenerateInvoicePdfJob;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SaleService
{
    public function __construct(
        private readonly NumberGeneratorService $numberGeneratorService,
        private readonly InventoryService $inventoryService,
        private readonly PaymentService $paymentService,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    public function create(array $data, User $user): Sale
    {
        return DB::transaction(function () use ($data, $user): Sale {
            $branchId = $data['branch_id'] ?? $user->branch_id;
            $status = SaleStatus::from($data['status'] ?? SaleStatus::Draft->value);
            $items = collect($data['items']);

            $totals = $items->reduce(function (array $carry, array $item): array {
                $lineSubtotal = (float) $item['quantity'] * (float) $item['unit_price'];
                $lineDiscount = (float) ($item['discount_amount'] ?? 0);
                $lineTotal = $lineSubtotal - $lineDiscount;

                $carry['subtotal'] += $lineSubtotal;
                $carry['discount_total'] += $lineDiscount;
                $carry['items'][] = array_merge($item, [
                    'subtotal' => $lineSubtotal,
                    'total_amount' => $lineTotal,
                ]);

                return $carry;
            }, [
                'subtotal' => 0,
                'discount_total' => 0,
                'items' => [],
            ]);

            $transportFee = (float) ($data['transport_fee'] ?? 0);
            $otherCharges = (float) ($data['other_charges'] ?? 0);
            $grandTotal = $totals['subtotal'] - $totals['discount_total'] + $transportFee + $otherCharges;

            $sale = Sale::query()->create([
                'branch_id' => $branchId,
                'customer_id' => $data['customer_id'] ?? null,
                'created_by' => $user->id,
                'sale_number' => $this->numberGeneratorService->nextSaleNumber($branchId),
                'sale_date' => $data['sale_date'] ?? now()->toDateString(),
                'status' => $status,
                'payment_status' => SettlementStatus::Unpaid,
                'currency' => $data['currency'] ?? 'NGN',
                'item_count' => count($totals['items']),
                'subtotal' => $totals['subtotal'],
                'discount_total' => $totals['discount_total'],
                'transport_fee' => $transportFee,
                'other_charges' => $otherCharges,
                'total_amount' => $grandTotal,
                'amount_paid' => 0,
                'balance_due' => $grandTotal,
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
                'metadata' => $data['metadata'] ?? null,
            ]);

            foreach ($totals['items'] as $index => $item) {
                $product = Product::query()->lockForUpdate()->findOrFail($item['product_id']);

                $saleItem = SaleItem::query()->create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'description' => $item['description'] ?? $product->name,
                    'quantity' => $item['quantity'],
                    'unit_cost' => $product->cost_price,
                    'unit_price' => $item['unit_price'],
                    'discount_amount' => $item['discount_amount'] ?? 0,
                    'subtotal' => $item['subtotal'],
                    'total_amount' => $item['total_amount'],
                    'sort_order' => $index,
                ]);

                if ($status === SaleStatus::Completed) {
                    $this->inventoryService->adjust(
                        product: $product,
                        quantityDelta: -1 * (float) $saleItem->quantity,
                        type: StockMovementType::Sale,
                        user: $user,
                        source: $sale,
                        notes: "Sale {$sale->sale_number} completed",
                        referenceNumber: $sale->sale_number,
                    );
                }
            }

            $invoice = Invoice::query()->create([
                'branch_id' => $branchId,
                'sale_id' => $sale->id,
                'customer_id' => $sale->customer_id,
                'issued_by' => $user->id,
                'invoice_number' => $this->numberGeneratorService->nextInvoiceNumber($branchId),
                'invoice_date' => $sale->sale_date,
                'due_date' => $data['due_date'] ?? $sale->sale_date,
                'status' => $status === SaleStatus::Completed ? InvoiceStatus::Issued : InvoiceStatus::Draft,
                'currency' => $sale->currency,
                'subtotal' => $sale->subtotal,
                'charges_total' => $sale->transport_fee + $sale->other_charges,
                'total_amount' => $sale->total_amount,
                'amount_paid' => 0,
                'balance_due' => $sale->total_amount,
                'notes' => $sale->notes,
                'metadata' => ['sale_number' => $sale->sale_number],
            ]);

            if (! empty($data['tag_ids'])) {
                $sale->syncTagsByIds($data['tag_ids']);
            }

            if (! empty($data['payment']['amount'])) {
                $this->paymentService->record([
                    'branch_id' => $branchId,
                    'invoice_id' => $invoice->id,
                    'sale_id' => $sale->id,
                    'customer_id' => $sale->customer_id,
                    'payment_date' => $data['payment']['payment_date'] ?? $sale->sale_date,
                    'method' => $data['payment']['method'] ?? null,
                    'amount' => $data['payment']['amount'],
                    'reference_number' => $data['payment']['reference_number'] ?? null,
                    'notes' => $data['payment']['notes'] ?? 'Initial sale payment',
                ], $user);
            }

            $this->auditLogService->log(
                event: 'sale.created',
                description: "Sale {$sale->sale_number} created",
                auditable: $sale,
                newValues: $sale->toArray(),
                user: $user,
                branchId: $branchId,
            );

            if ($status === SaleStatus::Completed) {
                event(new SaleCompleted($sale->fresh(['invoice', 'items.product'])));
                GenerateInvoicePdfJob::dispatch($invoice->id);
                CheckLowStockJob::dispatch($branchId);
            }

            return $sale->load(['customer', 'items.product', 'invoice', 'tags']);
        });
    }
}
