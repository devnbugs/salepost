<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseItem extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseItemFactory> */
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'description',
        'quantity',
        'unit_cost',
        'total_cost',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:3',
            'unit_cost' => 'decimal:2',
            'total_cost' => 'decimal:2',
        ];
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
