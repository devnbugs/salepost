<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Enums\StockMovementType;
use App\Http\Requests\AdjustStockRequest;
use App\Http\Requests\SaveProductRequest;
use App\Models\Branch;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Tag;
use App\Services\AuditLogService;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $products = Product::query()
            ->with(['branch', 'category', 'tags'])
            ->search($request->string('search')->toString())
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->toString()))
            ->when($request->filled('category_id'), fn ($query) => $query->where('product_category_id', $request->integer('category_id')))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'status', 'category_id']),
            'categories' => ProductCategory::query()->orderBy('name')->get(['id', 'name']),
            'stats' => [
                'total' => Product::query()->count(),
                'low_stock' => Product::query()->lowStock()->count(),
            ],
            'status_options' => ProductStatus::options(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Product::class);

        return Inertia::render('Products/Form', $this->formData());
    }

    public function store(
        SaveProductRequest $request,
        InventoryService $inventoryService,
        AuditLogService $auditLogService,
    ): RedirectResponse {
        $data = $request->validated();

        $product = Product::query()->create([
            ...collect($data)->except(['tag_ids', 'current_stock'])->toArray(),
            'branch_id' => $data['branch_id'] ?? $request->user()->branch_id,
            'current_stock' => 0,
        ]);

        if (! empty($data['tag_ids'])) {
            $product->syncTagsByIds($data['tag_ids']);
        }

        if ((float) ($data['current_stock'] ?? 0) !== 0.0) {
            $inventoryService->adjust(
                product: $product,
                quantityDelta: (float) $data['current_stock'],
                type: StockMovementType::Opening,
                user: $request->user(),
                source: $product,
                notes: 'Opening stock',
                referenceNumber: $product->slug,
            );
        }

        $auditLogService->log(
            event: 'product.created',
            description: "Product {$product->name} created",
            auditable: $product,
            newValues: $product->toArray(),
            user: $request->user(),
            branchId: $product->branch_id,
        );

        return redirect()
            ->route('products.show', $product)
            ->with('success', 'Material saved successfully.');
    }

    public function show(Product $product): Response
    {
        $this->authorize('view', $product);

        return Inertia::render('Products/Show', [
            'product' => $product->load([
                'branch',
                'category',
                'tags',
                'stockMovements.user',
                'saleItems.sale',
                'purchaseItems.purchase',
            ]),
        ]);
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        return Inertia::render('Products/Form', $this->formData($product));
    }

    public function update(
        SaveProductRequest $request,
        Product $product,
        InventoryService $inventoryService,
        AuditLogService $auditLogService,
    ): RedirectResponse {
        $this->authorize('update', $product);

        $oldValues = $product->toArray();
        $data = $request->validated();
        $targetStock = array_key_exists('current_stock', $data) ? (float) $data['current_stock'] : null;

        $product->fill(collect($data)->except(['tag_ids', 'current_stock'])->toArray());
        $product->save();

        if (! empty($data['tag_ids'])) {
            $product->syncTagsByIds($data['tag_ids']);
        }

        if (! is_null($targetStock)) {
            $difference = $targetStock - (float) $product->fresh()->current_stock;

            if ($difference !== 0.0) {
                $inventoryService->adjust(
                    product: $product,
                    quantityDelta: $difference,
                    type: StockMovementType::Correction,
                    user: $request->user(),
                    source: $product,
                    notes: 'Manual stock correction',
                    referenceNumber: $product->slug,
                );
            }
        }

        $auditLogService->log(
            event: 'product.updated',
            description: "Product {$product->name} updated",
            auditable: $product,
            oldValues: $oldValues,
            newValues: $product->fresh()->toArray(),
            user: $request->user(),
            branchId: $product->branch_id,
        );

        return redirect()
            ->route('products.show', $product)
            ->with('success', 'Material updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Material archived successfully.');
    }

    public function adjustStock(
        AdjustStockRequest $request,
        Product $product,
        InventoryService $inventoryService,
    ): RedirectResponse {
        $inventoryService->adjust(
            product: $product,
            quantityDelta: (float) $request->validated('quantity'),
            type: StockMovementType::from($request->validated('type')),
            user: $request->user(),
            source: $product,
            notes: $request->validated('notes'),
            referenceNumber: $product->slug,
        );

        return redirect()
            ->route('products.show', $product)
            ->with('success', 'Stock updated successfully.');
    }

    private function formData(?Product $product = null): array
    {
        return [
            'product' => $product?->load('tags'),
            'categories' => ProductCategory::query()->orderBy('name')->get(['id', 'name']),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
            'status_options' => ProductStatus::options(),
        ];
    }
}
