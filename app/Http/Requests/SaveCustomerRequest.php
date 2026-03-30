<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can($this->route('customer') ? 'customers.update' : 'customers.create');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'balance' => ['nullable', 'numeric'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
