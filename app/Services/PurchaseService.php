<?php

namespace App\Services;

use App\Enums\PurchaseStatus;
use App\Enums\StockMovementType;
use App\Events\PurchaseRecorded;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    public function __construct(
        private readonly NumberGeneratorService $numberGeneratorService,
        private readonly InventoryService $inventoryService,
        private readonly PaymentService $paymentService,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    public function create(array $data, User $user): Purchase
    {
        return DB::transaction(function () use ($data, $user): Purchase {
            $branchId = $data['branch_id'] ?? $user->branch_id;
            $status = PurchaseStatus::from($data['status'] ?? PurchaseStatus::Received->value);
            $items = collect($data['items']);

            $subtotal = $items->sum(fn (array $item) => (float) $item['quantity'] * (float) $item['unit_cost']);
            $otherCharges = (float) ($data['other_charges'] ?? 0);
            $totalAmount = $subtotal + $otherCharges;

            $purchase = Purchase::query()->create([
                'branch_id' => $branchId,
                'supplier_id' => $data['supplier_id'] ?? null,
                'created_by' => $user->id,
                'purchase_number' => $this->numberGeneratorService->nextPurchaseNumber($branchId),
                'purchase_date' => $data['purchase_date'] ?? now()->toDateString(),
                'status' => $status,
                'payment_status' => 'unpaid',
                'currency' => $data['currency'] ?? 'NGN',
                'subtotal' => $subtotal,
                'other_charges' => $otherCharges,
                'total_amount' => $totalAmount,
                'amount_paid' => 0,
                'balance_due' => $totalAmount,
                'attachment_path' => $data['attachment_path'] ?? null,
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
                'metadata' => $data['metadata'] ?? null,
            ]);

            foreach ($items as $index => $item) {
                $product = Product::query()->lockForUpdate()->findOrFail($item['product_id']);

                $purchaseItem = PurchaseItem::query()->create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $product->id,
                    'description' => $item['description'] ?? $product->name,
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'total_cost' => (float) $item['quantity'] * (float) $item['unit_cost'],
                    'sort_order' => $index,
                ]);

                if ($status === PurchaseStatus::Received) {
                    $this->inventoryService->adjust(
                        product: $product,
                        quantityDelta: (float) $purchaseItem->quantity,
                        type: StockMovementType::Purchase,
                        user: $user,
                        source: $purchase,
                        notes: "Purchase {$purchase->purchase_number} received",
                        referenceNumber: $purchase->purchase_number,
                    );
                }
            }

            if (! empty($data['tag_ids'])) {
                $purchase->syncTagsByIds($data['tag_ids']);
            }

            if (! empty($data['payment']['amount'])) {
                $this->paymentService->record([
                    'branch_id' => $branchId,
                    'purchase_id' => $purchase->id,
                    'supplier_id' => $purchase->supplier_id,
                    'payment_date' => $data['payment']['payment_date'] ?? $purchase->purchase_date,
                    'method' => $data['payment']['method'] ?? null,
                    'amount' => $data['payment']['amount'],
                    'reference_number' => $data['payment']['reference_number'] ?? null,
                    'notes' => $data['payment']['notes'] ?? 'Initial supplier payment',
                    'category_name' => 'Supplier Payment',
                ], $user);
            }

            $this->auditLogService->log(
                event: 'purchase.created',
                description: "Purchase {$purchase->purchase_number} created",
                auditable: $purchase,
                newValues: $purchase->toArray(),
                user: $user,
                branchId: $branchId,
            );

            event(new PurchaseRecorded($purchase->fresh(['items.product', 'supplier'])));

            return $purchase->load(['supplier', 'items.product', 'tags']);
        });
    }
}
