<?php

namespace App\Models;

use App\Enums\SaleStatus;
use App\Enums\SettlementStatus;
use App\Models\Concerns\InteractsWithTags;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    /** @use HasFactory<\Database\Factories\SaleFactory> */
    use HasFactory, InteractsWithTags, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'customer_id',
        'created_by',
        'sale_number',
        'sale_date',
        'status',
        'payment_status',
        'currency',
        'item_count',
        'subtotal',
        'discount_total',
        'transport_fee',
        'other_charges',
        'total_amount',
        'amount_paid',
        'balance_due',
        'description',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'sale_date' => 'date',
            'status' => SaleStatus::class,
            'payment_status' => SettlementStatus::class,
            'subtotal' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'transport_fee' => 'decimal:2',
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

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
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
                ->where('sale_number', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->orWhereHas('customer', fn (Builder $customer) => $customer->where('name', 'like', "%{$term}%"))
                ->orWhereHas('invoice', fn (Builder $invoice) => $invoice->where('invoice_number', 'like', "%{$term}%"));
        });
    }

    public function scopeBetweenDates(Builder $query, ?string $from, ?string $to): Builder
    {
        return $query
            ->when($from, fn (Builder $builder) => $builder->whereDate('sale_date', '>=', $from))
            ->when($to, fn (Builder $builder) => $builder->whereDate('sale_date', '<=', $to));
    }
}
