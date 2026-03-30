<?php

namespace App\Services;

use App\Models\CashTransaction;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;

class ReportService
{
    public function overview(array $filters = []): array
    {
        $branchId = $filters['branch_id'] ?? null;
        $from = $filters['from'] ?? now()->subDays(30)->toDateString();
        $to = $filters['to'] ?? now()->toDateString();

        $sales = Sale::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->betweenDates($from, $to);

        $purchases = Purchase::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->whereBetween('purchase_date', [$from, $to]);

        $cash = CashTransaction::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->betweenDates($from, $to);

        $invoices = Invoice::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->whereBetween('invoice_date', [$from, $to]);

        return [
            'summary' => [
                'sales_total' => (float) $sales->sum('total_amount'),
                'purchase_total' => (float) $purchases->sum('total_amount'),
                'cash_in_total' => (float) (clone $cash)->where('direction', 'inflow')->sum('amount'),
                'cash_out_total' => (float) (clone $cash)->where('direction', 'outflow')->sum('amount'),
                'net_cash_flow' => (float) (clone $cash)->where('direction', 'inflow')->sum('amount') - (float) (clone $cash)->where('direction', 'outflow')->sum('amount'),
                'invoice_outstanding' => (float) $invoices->sum('balance_due'),
                'profit_estimate' => (float) $sales->sum('total_amount') - (float) $purchases->sum('total_amount'),
            ],
            'daily_sales' => (clone $sales)
                ->selectRaw('sale_date as label, sum(total_amount) as total')
                ->groupBy('sale_date')
                ->orderBy('sale_date')
                ->get(),
            'invoice_payments' => $invoices
                ->with('customer')
                ->orderByDesc('invoice_date')
                ->limit(20)
                ->get(),
            'product_movement' => Product::query()
                ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                ->withSum('saleItems as sold_quantity', 'quantity')
                ->withSum('purchaseItems as purchased_quantity', 'quantity')
                ->orderBy('name')
                ->get(),
            'filters' => [
                'from' => $from,
                'to' => $to,
                'branch_id' => $branchId,
            ],
        ];
    }
}
