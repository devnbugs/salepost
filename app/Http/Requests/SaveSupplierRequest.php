<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can($this->route('supplier') ? 'suppliers.update' : 'suppliers.create');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'materials_supplied' => ['nullable', 'array'],
            'materials_supplied.*' => ['string', 'max:100'],
            'balance' => ['nullable', 'numeric'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
