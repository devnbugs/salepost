<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveSupplierRequest;
use App\Models\Branch;
use App\Models\Supplier;
use App\Models\Tag;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Supplier::class);

        $suppliers = Supplier::query()
            ->withCount(['purchases'])
            ->search($request->string('search')->toString())
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search']),
            'stats' => [
                'total' => Supplier::query()->count(),
                'outstanding_balance' => Supplier::query()->sum('balance'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Supplier::class);

        return Inertia::render('Suppliers/Form', [
            'supplier' => null,
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function store(SaveSupplierRequest $request, AuditLogService $auditLogService): RedirectResponse
    {
        $data = $request->validated();

        $supplier = Supplier::query()->create([
            ...collect($data)->except('tag_ids')->toArray(),
            'branch_id' => $data['branch_id'] ?? $request->user()->branch_id,
        ]);

        if (! empty($data['tag_ids'])) {
            $supplier->syncTagsByIds($data['tag_ids']);
        }

        $auditLogService->log(
            event: 'supplier.created',
            description: "Supplier {$supplier->name} created",
            auditable: $supplier,
            newValues: $supplier->toArray(),
            user: $request->user(),
            branchId: $supplier->branch_id,
        );

        return redirect()
            ->route('suppliers.show', $supplier)
            ->with('success', 'Supplier saved successfully.');
    }

    public function show(Supplier $supplier): Response
    {
        $this->authorize('view', $supplier);

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier->load([
                'purchases.items.product',
                'payments',
                'cashTransactions',
                'documents',
                'tags',
            ]),
        ]);
    }

    public function edit(Supplier $supplier): Response
    {
        $this->authorize('update', $supplier);

        return Inertia::render('Suppliers/Form', [
            'supplier' => $supplier->load('tags'),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function update(
        SaveSupplierRequest $request,
        Supplier $supplier,
        AuditLogService $auditLogService,
    ): RedirectResponse {
        $this->authorize('update', $supplier);

        $oldValues = $supplier->toArray();
        $data = $request->validated();

        $supplier->update(collect($data)->except('tag_ids')->toArray());

        if (! empty($data['tag_ids'])) {
            $supplier->syncTagsByIds($data['tag_ids']);
        }

        $auditLogService->log(
            event: 'supplier.updated',
            description: "Supplier {$supplier->name} updated",
            auditable: $supplier,
            oldValues: $oldValues,
            newValues: $supplier->fresh()->toArray(),
            user: $request->user(),
            branchId: $supplier->branch_id,
        );

        return redirect()
            ->route('suppliers.show', $supplier)
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $this->authorize('delete', $supplier);
        $supplier->delete();

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Supplier archived successfully.');
    }
}
