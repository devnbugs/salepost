<?php

namespace App\Services;

use App\Enums\CashTransactionDirection;
use App\Enums\InvoiceStatus;
use App\Enums\SettlementStatus;
use App\Events\PaymentRecorded;
use App\Models\CashTransaction;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\User;
use App\Notifications\InvoicePaymentReceivedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class PaymentService
{
    public function __construct(
        private readonly NumberGeneratorService $numberGeneratorService,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    public function record(array $data, User $user, bool $generateCashTransaction = true): Payment
    {
        return DB::transaction(function () use ($data, $user, $generateCashTransaction): Payment {
            $invoice = isset($data['invoice_id']) ? Invoice::query()->lockForUpdate()->find($data['invoice_id']) : null;
            $purchase = isset($data['purchase_id']) ? Purchase::query()->lockForUpdate()->find($data['purchase_id']) : null;
            $branchId = $data['branch_id'] ?? $invoice?->branch_id ?? $purchase?->branch_id ?? $user->branch_id;
            $direction = $invoice ? CashTransactionDirection::Inflow : CashTransactionDirection::Outflow;

            $cashTransaction = null;

            if ($generateCashTransaction) {
                $cashTransaction = CashTransaction::query()->create([
                    'branch_id' => $branchId,
                    'expense_category_id' => $data['expense_category_id'] ?? null,
                    'customer_id' => $data['customer_id'] ?? $invoice?->customer_id,
                    'supplier_id' => $data['supplier_id'] ?? $purchase?->supplier_id,
                    'sale_id' => $data['sale_id'] ?? $invoice?->sale_id,
                    'purchase_id' => $purchase?->id,
                    'recorded_by' => $user->id,
                    'transaction_number' => $this->numberGeneratorService->nextCashTransactionNumber($branchId),
                    'transaction_date' => $data['payment_date'] ?? now()->toDateString(),
                    'direction' => $direction,
                    'category_name' => $data['category_name'] ?? ($invoice ? 'Sales Payment' : 'Supplier Payment'),
                    'payment_method' => $data['method'] ?? null,
                    'amount' => $data['amount'],
                    'reference_number' => $data['reference_number'] ?? null,
                    'description' => $data['notes'] ?? null,
                    'metadata' => ['auto_generated' => true],
                ]);
            }

            $payment = Payment::query()->create([
                'branch_id' => $branchId,
                'invoice_id' => $invoice?->id,
                'sale_id' => $data['sale_id'] ?? $invoice?->sale_id,
                'purchase_id' => $purchase?->id,
                'customer_id' => $data['customer_id'] ?? $invoice?->customer_id,
                'supplier_id' => $data['supplier_id'] ?? $purchase?->supplier_id,
                'cash_transaction_id' => $cashTransaction?->id ?? $data['cash_transaction_id'] ?? null,
                'recorded_by' => $user->id,
                'payment_number' => $this->numberGeneratorService->nextPaymentNumber($branchId),
                'payment_date' => $data['payment_date'] ?? now()->toDateString(),
                'direction' => $direction,
                'status' => $data['status'] ?? 'confirmed',
                'method' => $data['method'] ?? null,
                'amount' => $data['amount'],
                'reference_number' => $data['reference_number'] ?? null,
                'notes' => $data['notes'] ?? null,
                'metadata' => $data['metadata'] ?? null,
            ]);

            if ($invoice) {
                $this->syncInvoiceBalances($invoice->refresh());
            }

            if ($purchase) {
                $this->syncPurchaseBalances($purchase->refresh());
            }

            $this->auditLogService->log(
                event: 'payment.recorded',
                description: "Payment {$payment->payment_number} recorded",
                auditable: $payment,
                newValues: $payment->toArray(),
                user: $user,
                branchId: $branchId,
            );

            event(new PaymentRecorded($payment));

            if ($invoice) {
                Notification::send(
                    User::query()->role(['owner', 'manager'])->get(),
                    new InvoicePaymentReceivedNotification($payment),
                );
            }

            return $payment->load(['invoice', 'customer', 'supplier', 'cashTransaction']);
        });
    }

    public function syncInvoiceBalances(Invoice $invoice): void
    {
        $amountPaid = (float) $invoice->payments()->sum('amount');
        $balanceDue = max((float) $invoice->total_amount - $amountPaid, 0);

        $status = match (true) {
            $balanceDue <= 0 => InvoiceStatus::Paid,
            $amountPaid > 0 => InvoiceStatus::PartPaid,
            $invoice->status === InvoiceStatus::Draft => InvoiceStatus::Draft,
            default => InvoiceStatus::Issued,
        };

        $invoice->forceFill([
            'amount_paid' => $amountPaid,
            'balance_due' => $balanceDue,
            'status' => $status,
        ])->save();

        if ($invoice->sale) {
            $invoice->sale->forceFill([
                'amount_paid' => $amountPaid,
                'balance_due' => $balanceDue,
                'payment_status' => match (true) {
                    $balanceDue <= 0 => SettlementStatus::Paid,
                    $amountPaid > 0 => SettlementStatus::PartPaid,
                    default => SettlementStatus::Unpaid,
                },
            ])->save();
        }

        if ($invoice->customer) {
            $this->syncCustomerBalance($invoice->customer);
        }
    }

    public function syncPurchaseBalances(Purchase $purchase): void
    {
        $amountPaid = (float) $purchase->payments()->sum('amount');
        $balanceDue = max((float) $purchase->total_amount - $amountPaid, 0);

        $purchase->forceFill([
            'amount_paid' => $amountPaid,
            'balance_due' => $balanceDue,
            'payment_status' => match (true) {
                $balanceDue <= 0 => SettlementStatus::Paid,
                $amountPaid > 0 => SettlementStatus::PartPaid,
                default => SettlementStatus::Unpaid,
            },
        ])->save();

        if ($purchase->supplier) {
            $this->syncSupplierBalance($purchase->supplier);
        }
    }

    public function syncCustomerBalance(Customer $customer): void
    {
        $customer->forceFill([
            'balance' => Invoice::query()
                ->where('customer_id', $customer->id)
                ->whereNot('status', InvoiceStatus::Cancelled->value)
                ->sum('balance_due'),
        ])->save();
    }

    public function syncSupplierBalance(Supplier $supplier): void
    {
        $supplier->forceFill([
            'balance' => Purchase::query()
                ->where('supplier_id', $supplier->id)
                ->whereNot('status', 'cancelled')
                ->sum('balance_due'),
        ])->save();
    }
}
