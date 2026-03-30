<?php

namespace App\Http\Requests;

use App\Enums\CashTransactionDirection;
use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCashTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('cash_transactions.create');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'expense_category_id' => ['nullable', 'exists:expense_categories,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'sale_id' => ['nullable', 'exists:sales,id'],
            'purchase_id' => ['nullable', 'exists:purchases,id'],
            'transaction_date' => ['required', 'date'],
            'direction' => ['required', Rule::in(CashTransactionDirection::values())],
            'category_name' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['nullable', Rule::in(PaymentMethod::values())],
            'amount' => ['required', 'numeric', 'gt:0'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
