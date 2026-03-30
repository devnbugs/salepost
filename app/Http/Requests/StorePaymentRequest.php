<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('payments.record');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'invoice_id' => ['nullable', 'exists:invoices,id'],
            'purchase_id' => ['nullable', 'exists:purchases,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'payment_date' => ['required', 'date'],
            'method' => ['nullable', Rule::in(PaymentMethod::values())],
            'amount' => ['required', 'numeric', 'gt:0'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
