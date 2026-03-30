<?php

namespace App\Services;

use App\Models\CashTransaction;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function data(array $filters = []): array
    {
        $branchId = $filters['branch_id'] ?? null;
        $from = isset($filters['from']) ? Carbon::parse($filters['from'])->startOfDay() : now()->startOfMonth();
        $to = isset($filters['to']) ? Carbon::parse($filters['to'])->endOfDay() : now()->endOfDay();

        $salesBase = Sale::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()]);

        $cashBase = CashTransaction::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->whereBetween('transaction_date', [$from->toDateString(), $to->toDateString()]);

        return [
            'cards' => [
                'today_sales_total' => (float) Sale::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->whereDate('sale_date', today())
                    ->sum('total_amount'),
                'weekly_sales_total' => (float) Sale::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->whereBetween('sale_date', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()])
                    ->sum('total_amount'),
                'monthly_sales_total' => (float) Sale::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->whereBetween('sale_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()])
                    ->sum('total_amount'),
                'cash_in_today' => (float) CashTransaction::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->where('direction', 'inflow')
                    ->whereDate('transaction_date', today())
                    ->sum('amount'),
                'cash_out_today' => (float) CashTransaction::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->where('direction', 'outflow')
                    ->whereDate('transaction_date', today())
                    ->sum('amount'),
                'outstanding_customer_balances' => (float) Customer::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->sum('balance'),
                'low_stock_alerts' => Product::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->lowStock()
                    ->count(),
            ],
            'recent_invoices' => Invoice::query()
                ->with(['customer', 'sale'])
                ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                ->latest('invoice_date')
                ->limit(6)
                ->get(),
            'recent_cash_transactions' => CashTransaction::query()
                ->with(['customer', 'supplier'])
                ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                ->latest('transaction_date')
                ->limit(6)
                ->get(),
            'sales_by_day' => $salesBase
                ->selectRaw('sale_date as label, sum(total_amount) as total')
                ->groupBy('sale_date')
                ->orderBy('sale_date')
                ->get(),
            'cash_flow' => $cashBase
                ->selectRaw('transaction_date as label, direction, sum(amount) as total')
                ->groupBy('transaction_date', 'direction')
                ->orderBy('transaction_date')
                ->get(),
            'sales_by_product' => SaleItem::query()
                ->select('products.name as label', DB::raw('sum(sale_items.total_amount) as total'))
                ->join('products', 'products.id', '=', 'sale_items.product_id')
                ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
                ->when($branchId, fn ($query) => $query->where('sales.branch_id', $branchId))
                ->whereBetween('sales.sale_date', [$from->toDateString(), $to->toDateString()])
                ->groupBy('products.name')
                ->orderByDesc('total')
                ->limit(6)
                ->get(),
            'top_customers' => Sale::query()
                ->select('customers.name as label', DB::raw('sum(sales.total_amount) as total'))
                ->join('customers', 'customers.id', '=', 'sales.customer_id')
                ->when($branchId, fn ($query) => $query->where('sales.branch_id', $branchId))
                ->whereBetween('sales.sale_date', [$from->toDateString(), $to->toDateString()])
                ->groupBy('customers.name')
                ->orderByDesc('total')
                ->limit(5)
                ->get(),
            'top_selling_material' => SaleItem::query()
                ->select('products.name as label', DB::raw('sum(sale_items.quantity) as total'))
                ->join('products', 'products.id', '=', 'sale_items.product_id')
                ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
                ->when($branchId, fn ($query) => $query->where('sales.branch_id', $branchId))
                ->whereBetween('sales.sale_date', [$from->toDateString(), $to->toDateString()])
                ->groupBy('products.name')
                ->orderByDesc('total')
                ->first(),
            'low_stock_products' => Product::query()
                ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                ->lowStock()
                ->orderBy('current_stock')
                ->limit(8)
                ->get(),
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
                'branch_id' => $branchId,
            ],
        ];
    }
}
