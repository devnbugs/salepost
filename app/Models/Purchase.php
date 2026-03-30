<?php

namespace App\Models;

use App\Enums\PurchaseStatus;
use App\Enums\SettlementStatus;
use App\Models\Concerns\InteractsWithTags;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseFactory> */
    use HasFactory, InteractsWithTags, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'supplier_id',
        'created_by',
        'purchase_number',
        'purchase_date',
        'status',
        'payment_status',
        'currency',
        'subtotal',
        'other_charges',
        'total_amount',
        'amount_paid',
        'balance_due',
        'attachment_path',
        'description',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'status' => PurchaseStatus::class,
            'payment_status' => SettlementStatus::class,
            'subtotal' => 'decimal:2',
            'other_charges' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'balance_due' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function cashTransactions(): HasMany
    {
        return $this->hasMany(CashTransaction::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($term): void {
            $builder
                ->where('purchase_number', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->orWhereHas('supplier', fn (Builder $supplier) => $supplier->where('name', 'like', "%{$term}%"));
        });
    }
}
