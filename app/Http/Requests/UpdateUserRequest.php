<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Support\PermissionMatrix;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('users.update');
    }

    public function rules(): array
    {
        /** @var User|null $target */
        $target = $this->route('user');

        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($target?->id)],
            'phone' => ['nullable', 'string', 'max:50'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'role' => ['required', Rule::in(PermissionMatrix::roles())],
            'is_active' => ['nullable', 'boolean'],
            'password' => ['nullable', 'confirmed', Password::min(8)],
        ];
    }
}
