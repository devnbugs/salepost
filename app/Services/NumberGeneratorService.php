<?php

namespace App\Services;

use App\Models\CashTransaction;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Purchase;
use App\Models\Sale;
use Illuminate\Database\Eloquent\Model;

class NumberGeneratorService
{
    public function __construct(
        private readonly SettingsService $settingsService,
    ) {
    }

    public function nextSaleNumber(?int $branchId = null): string
    {
        return $this->make('SAL', Sale::class, 'sale_number', $branchId);
    }

    public function nextInvoiceNumber(?int $branchId = null): string
    {
        $prefix = $this->settingsService->get('business', 'invoice_prefix', 'INV', $branchId);

        return $this->make((string) $prefix, Invoice::class, 'invoice_number', $branchId);
    }

    public function nextPurchaseNumber(?int $branchId = null): string
    {
        return $this->make('PUR', Purchase::class, 'purchase_number', $branchId);
    }

    public function nextPaymentNumber(?int $branchId = null): string
    {
        return $this->make('PAY', Payment::class, 'payment_number', $branchId);
    }

    public function nextCashTransactionNumber(?int $branchId = null): string
    {
        return $this->make('CSH', CashTransaction::class, 'transaction_number', $branchId);
    }

    private function make(string $prefix, string $modelClass, string $column, ?int $branchId): string
    {
        /** @var Model $modelClass */
        $count = $modelClass::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->whereDate('created_at', today())
            ->count() + 1;

        return sprintf('%s-%s-%04d', strtoupper($prefix), now()->format('Ymd'), $count);
    }
}
