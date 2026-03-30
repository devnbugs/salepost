<?php

namespace App\Http\Controllers;

use App\Enums\PurchaseStatus;
use App\Http\Requests\StorePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Tag;
use App\Services\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Purchase::class);

        $purchases = Purchase::query()
            ->with(['supplier', 'payments'])
            ->search($request->string('search')->toString())
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->toString()))
            ->latest('purchase_date')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'filters' => $request->only(['search', 'status']),
            'status_options' => PurchaseStatus::options(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Purchase::class);

        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::query()->orderBy('name')->get(['id', 'name', 'balance']),
            'products' => Product::query()->orderBy('name')->get(['id', 'name', 'cost_price', 'unit_of_measure']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
            'status_options' => PurchaseStatus::options(),
        ]);
    }

    public function store(StorePurchaseRequest $request, PurchaseService $purchaseService): RedirectResponse
    {
        $purchase = $purchaseService->create($request->validated(), $request->user());

        return redirect()
            ->route('purchases.show', $purchase)
            ->with('success', 'Purchase recorded successfully.');
    }

    public function show(Purchase $purchase): Response
    {
        $this->authorize('view', $purchase);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase->load([
                'supplier',
                'creator',
                'items.product',
                'payments.cashTransaction',
                'cashTransactions',
                'documents',
                'tags',
            ]),
        ]);
    }
}
