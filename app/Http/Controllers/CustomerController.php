<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveCustomerRequest;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Tag;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Customer::class);

        $customers = Customer::query()
            ->withCount(['sales', 'invoices'])
            ->search($request->string('search')->toString())
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
            'stats' => [
                'total' => Customer::query()->count(),
                'outstanding_balance' => Customer::query()->sum('balance'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Customer::class);

        return Inertia::render('Customers/Form', [
            'customer' => null,
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function store(SaveCustomerRequest $request, AuditLogService $auditLogService): RedirectResponse
    {
        $data = $request->validated();

        $customer = Customer::query()->create([
            ...collect($data)->except('tag_ids')->toArray(),
            'branch_id' => $data['branch_id'] ?? $request->user()->branch_id,
        ]);

        if (! empty($data['tag_ids'])) {
            $customer->syncTagsByIds($data['tag_ids']);
        }

        $auditLogService->log(
            event: 'customer.created',
            description: "Customer {$customer->name} created",
            auditable: $customer,
            newValues: $customer->toArray(),
            user: $request->user(),
            branchId: $customer->branch_id,
        );

        return redirect()
            ->route('customers.show', $customer)
            ->with('success', 'Customer saved successfully.');
    }

    public function show(Customer $customer): Response
    {
        $this->authorize('view', $customer);

        return Inertia::render('Customers/Show', [
            'customer' => $customer->load([
                'sales.invoice',
                'invoices.payments',
                'cashTransactions',
                'documents',
                'tags',
            ]),
        ]);
    }

    public function edit(Customer $customer): Response
    {
        $this->authorize('update', $customer);

        return Inertia::render('Customers/Form', [
            'customer' => $customer->load('tags'),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function update(
        SaveCustomerRequest $request,
        Customer $customer,
        AuditLogService $auditLogService,
    ): RedirectResponse {
        $this->authorize('update', $customer);

        $oldValues = $customer->toArray();
        $data = $request->validated();

        $customer->update(collect($data)->except('tag_ids')->toArray());

        if (! empty($data['tag_ids'])) {
            $customer->syncTagsByIds($data['tag_ids']);
        }

        $auditLogService->log(
            event: 'customer.updated',
            description: "Customer {$customer->name} updated",
            auditable: $customer,
            oldValues: $oldValues,
            newValues: $customer->fresh()->toArray(),
            user: $request->user(),
            branchId: $customer->branch_id,
        );

        return redirect()
            ->route('customers.show', $customer)
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $this->authorize('delete', $customer);
        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer archived successfully.');
    }
}
