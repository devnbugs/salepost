<?php

namespace App\Http\Requests;

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can($this->route('product') ? 'products.update' : 'products.create');
    }

    public function rules(): array
    {
        /** @var Product|null $product */
        $product = $this->route('product');
        $branchId = $this->input('branch_id', $product?->branch_id ?? $this->user()?->branch_id);

        return [
            'branch_id' => ['nullable', 'exists:branches,id'],
            'product_category_id' => ['nullable', 'exists:product_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')
                    ->ignore($product?->id)
                    ->where(fn ($query) => $query->where('branch_id', $branchId)),
            ],
            'sku' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'unit_of_measure' => ['required', 'string', 'max:50'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'current_stock' => ['nullable', 'numeric'],
            'reorder_level' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(ProductStatus::values())],
            'notes' => ['nullable', 'string'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
