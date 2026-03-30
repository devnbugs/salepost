<?php

namespace App\Http\Controllers;

use App\Enums\SaleStatus;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Tag;
use App\Services\SaleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        $sales = Sale::query()
            ->with(['customer', 'invoice'])
            ->search($request->string('search')->toString())
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->toString()))
            ->betweenDates($request->string('from')->toString(), $request->string('to')->toString())
            ->latest('sale_date')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'status', 'from', 'to']),
            'status_options' => SaleStatus::options(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Sale::class);

        return Inertia::render('Sales/Create', [
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name', 'phone', 'balance']),
            'products' => Product::query()->orderBy('name')->get(['id', 'name', 'current_stock', 'selling_price', 'cost_price', 'unit_of_measure']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
            'status_options' => SaleStatus::options(),
        ]);
    }

    public function store(StoreSaleRequest $request, SaleService $saleService): RedirectResponse
    {
        $sale = $saleService->create($request->validated(), $request->user());

        return redirect()
            ->route('sales.show', $sale)
            ->with('success', 'Sale recorded successfully.');
    }

    public function show(Sale $sale): Response
    {
        $this->authorize('view', $sale);

        return Inertia::render('Sales/Show', [
            'sale' => $sale->load([
                'customer',
                'creator',
                'items.product',
                'invoice.payments',
                'cashTransactions',
                'documents',
                'tags',
            ]),
        ]);
    }
}
