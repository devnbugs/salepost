<?php

namespace App\Models;

use App\Enums\StockMovementType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockMovement extends Model
{
    /** @use HasFactory<\Database\Factories\StockMovementFactory> */
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'product_id',
        'user_id',
        'type',
        'quantity',
        'quantity_before',
        'quantity_after',
        'reference_number',
        'movement_date',
        'notes',
        'metadata',
        'source_type',
        'source_id',
    ];

    protected function casts(): array
    {
        return [
            'type' => StockMovementType::class,
            'quantity' => 'decimal:3',
            'quantity_before' => 'decimal:3',
            'quantity_after' => 'decimal:3',
            'movement_date' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function source(): MorphTo
    {
        return $this->morphTo();
    }
}
