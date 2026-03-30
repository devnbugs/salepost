<?php

namespace App\Http\Controllers;

use App\Enums\CashTransactionDirection;
use App\Enums\PaymentMethod;
use App\Http\Requests\StoreCashTransactionRequest;
use App\Models\CashTransaction;
use App\Models\Customer;
use App\Models\ExpenseCategory;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\Tag;
use App\Services\CashTransactionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashTransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', CashTransaction::class);

        $transactions = CashTransaction::query()
            ->with(['expenseCategory', 'customer', 'supplier', 'recorder', 'tags'])
            ->when($request->filled('direction'), fn ($query) => $query->where('direction', $request->string('direction')->toString()))
            ->when($request->filled('payment_method'), fn ($query) => $query->where('payment_method', $request->string('payment_method')->toString()))
            ->betweenDates($request->string('from')->toString(), $request->string('to')->toString())
            ->latest('transaction_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('CashTransactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['direction', 'payment_method', 'from', 'to']),
            'direction_options' => CashTransactionDirection::options(),
            'payment_methods' => PaymentMethod::options(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', CashTransaction::class);

        return Inertia::render('CashTransactions/Create', [
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::query()->orderBy('name')->get(['id', 'name']),
            'sales' => Sale::query()->latest('sale_date')->limit(25)->get(['id', 'sale_number']),
            'purchases' => Purchase::query()->latest('purchase_date')->limit(25)->get(['id', 'purchase_number']),
            'categories' => ExpenseCategory::query()->orderBy('name')->get(['id', 'name', 'type']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
            'direction_options' => CashTransactionDirection::options(),
            'payment_methods' => PaymentMethod::options(),
        ]);
    }

    public function store(
        StoreCashTransactionRequest $request,
        CashTransactionService $cashTransactionService,
    ): RedirectResponse {
        $cashTransactionService->record($request->validated(), $request->user());

        return redirect()
            ->route('cash-transactions.index')
            ->with('success', 'Cash transaction recorded successfully.');
    }
}
