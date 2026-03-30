<?php

namespace App\Http\Requests;

use App\Enums\StockMovementType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdjustStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('stock.adjust');
    }

    public function rules(): array
    {
        return [
            'quantity' => ['required', 'numeric', 'not_in:0'],
            'type' => ['required', Rule::in(StockMovementType::values())],
            'notes' => ['nullable', 'string'],
        ];
    }
}
