<?php

namespace App\Http\Requests;

use App\Enums\ThemePreference;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('settings.update');
    }

    public function rules(): array
    {
        return [
            'business_name' => ['required', 'string', 'max:255'],
            'business_address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:255'],
            'currency' => ['required', 'string', 'size:3'],
            'invoice_prefix' => ['required', 'string', 'max:10'],
            'allow_negative_stock' => ['nullable', 'boolean'],
            'default_theme' => ['nullable', Rule::in(ThemePreference::values())],
        ];
    }
}
