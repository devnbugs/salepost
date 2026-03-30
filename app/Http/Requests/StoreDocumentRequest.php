<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('documents.create');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'sale_id' => ['nullable', 'exists:sales,id'],
            'purchase_id' => ['nullable', 'exists:purchases,id'],
            'invoice_id' => ['nullable', 'exists:invoices,id'],
            'cash_transaction_id' => ['nullable', 'exists:cash_transactions,id'],
            'title' => ['required', 'string', 'max:255'],
            'document_type' => ['required', Rule::in(DocumentType::values())],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'document_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'file' => ['required', 'file', 'max:10240'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
