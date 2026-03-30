<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use App\Enums\SaleStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('sales.create');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'sale_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(SaleStatus::values())],
            'transport_fee' => ['nullable', 'numeric', 'min:0'],
            'other_charges' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
            'payment.amount' => ['nullable', 'numeric', 'gt:0'],
            'payment.payment_date' => ['nullable', 'date'],
            'payment.method' => ['nullable', Rule::in(PaymentMethod::values())],
            'payment.reference_number' => ['nullable', 'string', 'max:255'],
            'payment.notes' => ['nullable', 'string'],
        ];
    }
}
