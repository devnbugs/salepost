<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Handle the incoming request to load the operator dashboard.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $branchId = $user->branch_id;

        // If user has no branch associated (e.g. Super Admin), fetch the default or first branch as active context
        if (! $branchId) {
            $branch = Branch::where('is_default', true)->first() ?? Branch::first();
            $branchId = $branch?->id;
        } else {
            $branch = $user->branch;
        }

        $dashboardData = $this->dashboardService->data([
            'branch_id' => $branchId,
        ]);

        return Inertia::render('dashboard', [
            'cards' => $dashboardData['cards'],
            'recent_invoices' => $dashboardData['recent_invoices'],
            'recent_cash_transactions' => $dashboardData['recent_cash_transactions'],
            'sales_by_day' => $dashboardData['sales_by_day'],
            'cash_flow' => $dashboardData['cash_flow'],
            'sales_by_product' => $dashboardData['sales_by_product'],
            'top_customers' => $dashboardData['top_customers'],
            'top_selling_material' => $dashboardData['top_selling_material'] ? [
                'name' => $dashboardData['top_selling_material']->label,
                'total' => (float) $dashboardData['top_selling_material']->total,
            ] : null,
            'low_stock_products' => $dashboardData['low_stock_products'],
            'spot_prices' => $dashboardData['spot_prices'] ?? [],
            'branch' => $branch ? [
                'id' => $branch->id,
                'name' => $branch->name,
                'code' => $branch->code,
                'address' => $branch->address,
            ] : [
                'name' => 'Kano Main Yard',
                'code' => 'KANO-01',
                'address' => 'Kano, Nigeria',
            ],
            'filters' => $dashboardData['filters'],
        ]);
    }
}
