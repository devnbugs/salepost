<?php

namespace App\Services;

use App\Models\CashTransaction;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardService
{
    /**
     * Get aggregated analytical dashboard metrics, cached for speed.
     *
     * @param  array{branch_id?: int, from?: string, to?: string}  $filters
     */
    public function data(array $filters = []): array
    {
        $branchId = $filters['branch_id'] ?? null;
        $from = isset($filters['from']) ? Carbon::parse($filters['from'])->startOfDay() : now()->startOfMonth();
        $to = isset($filters['to']) ? Carbon::parse($filters['to'])->endOfDay() : now()->endOfDay();

        $cacheKey = 'dashboard_data_'.($branchId ?? 'all').'_'.$from->toDateString().'_'.$to->toDateString();

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($branchId, $from, $to) {
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
                    'total_stock_volume' => (float) Product::query()
                        ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                        ->where('status', 'active')
                        ->sum('current_stock'),
                    'today_cash_flow' => (float) CashTransaction::query()
                        ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                        ->whereDate('transaction_date', today())
                        ->selectRaw("SUM(CASE WHEN direction = 'inflow' THEN amount ELSE -amount END) as net")
                        ->value('net') ?? 0.0,
                    'active_products_count' => Product::query()
                        ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                        ->where('status', 'active')
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
                'spot_prices' => Product::query()
                    ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
                    ->where('status', 'active')
                    ->select('name', 'selling_price', 'unit_of_measure')
                    ->get()
                    ->map(fn ($p) => [
                        'name' => $p->name,
                        'price' => (float) $p->selling_price,
                        'unit' => $p->unit_of_measure,
                    ])
                    ->whenEmpty(fn () => collect([
                        ['name' => 'Karfe (Iron)', 'price' => 650.0, 'unit' => 'kg'],
                        ['name' => 'Brass', 'price' => 4100.0, 'unit' => 'kg'],
                        ['name' => 'Jar Waya (Copper Wire)', 'price' => 2300.0, 'unit' => 'kg'],
                        ['name' => 'Aluminium', 'price' => 2500.0, 'unit' => 'kg'],
                        ['name' => 'Copper Heavy', 'price' => 6500.0, 'unit' => 'kg'],
                    ])),
                'filters' => [
                    'from' => $from->toDateString(),
                    'to' => $to->toDateString(),
                    'branch_id' => $branchId,
                ],
            ];
        });
    }

    /**
     * Calculate and return live operational and environmental statistics for the public homepage.
     */
    public function getPublicHomepageStats(): array
    {
        return Cache::remember('public_homepage_stats', now()->addMinutes(5), function () {
            // Default fallbacks (realistic Nigerian scrap scrap-yard statistics)
            $totalVolume = 1420.0;
            $totalValue = 2529750.0;
            $totalPartners = 8;
            $materials = collect([
                ['name' => 'Karfe (Iron)', 'stock' => 1020.0, 'price' => 650.0, 'unit' => 'kg'],
                ['name' => 'Brass', 'stock' => 170.0, 'price' => 4100.0, 'unit' => 'kg'],
                ['name' => 'Jar Waya (Copper Wire)', 'stock' => 230.0, 'price' => 2300.0, 'unit' => 'kg'],
                ['name' => 'Aluminium', 'stock' => 265.0, 'price' => 2500.0, 'unit' => 'kg'],
                ['name' => 'Copper Heavy', 'stock' => 150.0, 'price' => 6500.0, 'unit' => 'kg'],
                ['name' => 'Battery Scrap', 'stock' => 100.0, 'price' => 4200.0, 'unit' => 'piece'],
                ['name' => 'Mixed Metals', 'stock' => 700.0, 'price' => 1700.0, 'unit' => 'kg'],
            ]);

            // Query live operational statistics if tables exist
            if (Schema::hasTable('sale_items')) {
                $totalVolume = (float) DB::table('sale_items')->sum('quantity');
            }

            if (Schema::hasTable('sales')) {
                $totalValue = (float) DB::table('sales')->sum('total_amount');
            }

            if (Schema::hasTable('customers') && Schema::hasTable('suppliers')) {
                $totalCustomers = DB::table('customers')->count();
                $totalSuppliers = DB::table('suppliers')->count();
                $totalPartners = $totalCustomers + $totalSuppliers;
            }

            if (Schema::hasTable('products')) {
                $products = DB::table('products')
                    ->select('name', 'current_stock', 'selling_price', 'unit_of_measure')
                    ->whereNull('deleted_at')
                    ->where('status', 'active')
                    ->get();

                if ($products->isNotEmpty()) {
                    $materials = $products->map(function ($product) {
                        return [
                            'name' => $product->name,
                            'stock' => (float) $product->current_stock,
                            'price' => (float) $product->selling_price,
                            'unit' => $product->unit_of_measure,
                        ];
                    })->toArray();
                } else {
                    $materials = $materials->toArray();
                }
            } else {
                $materials = $materials->toArray();
            }

            // Dynamic Environmental impact calculations
            $co2SavedTons = round(($totalVolume / 1000) * 1.8, 2);
            $treesSaved = (int) round($co2SavedTons * 15); // Average of 15 trees saved per ton of CO2 offset

            return [
                'stats' => [
                    'total_volume_kg' => $totalVolume,
                    'total_value_naira' => $totalValue,
                    'total_partners' => $totalPartners,
                    'co2_saved_tons' => $co2SavedTons,
                    'trees_saved' => $treesSaved,
                ],
                'materials' => $materials,
            ];
        });
    }
}
