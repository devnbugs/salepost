<?php

namespace App\Models;

use App\Models\Concerns\InteractsWithTags;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\SupplierFactory> */
    use HasFactory, InteractsWithTags, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'name',
        'phone',
        'email',
        'address',
        'materials_supplied',
        'balance',
        'notes',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'materials_supplied' => 'array',
            'balance' => 'decimal:2',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
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
                ->where('name', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%")
                ->orWhere('address', 'like', "%{$term}%");
        });
    }
}
