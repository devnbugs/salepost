<?php

namespace App\Http\Requests;

use App\Support\PermissionMatrix;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('users.create');
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'role' => ['required', Rule::in(PermissionMatrix::roles())],
            'is_active' => ['nullable', 'boolean'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ];
    }
}
