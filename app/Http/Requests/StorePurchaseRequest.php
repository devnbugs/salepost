<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use App\Enums\PurchaseStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('purchases.create');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'purchase_date' => ['required', 'date'],
            'status' => ['required', Rule::in(PurchaseStatus::values())],
            'other_charges' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
            'payment.amount' => ['nullable', 'numeric', 'gt:0'],
            'payment.payment_date' => ['nullable', 'date'],
            'payment.method' => ['nullable', Rule::in(PaymentMethod::values())],
            'payment.reference_number' => ['nullable', 'string', 'max:255'],
            'payment.notes' => ['nullable', 'string'],
        ];
    }
}
