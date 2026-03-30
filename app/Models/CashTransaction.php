<?php

namespace App\Models;

use App\Enums\CashTransactionDirection;
use App\Enums\PaymentMethod;
use App\Models\Concerns\InteractsWithTags;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CashTransaction extends Model
{
    /** @use HasFactory<\Database\Factories\CashTransactionFactory> */
    use HasFactory, InteractsWithTags, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'expense_category_id',
        'customer_id',
        'supplier_id',
        'sale_id',
        'purchase_id',
        'recorded_by',
        'transaction_number',
        'transaction_date',
        'direction',
        'category_name',
        'payment_method',
        'amount',
        'reference_number',
        'attachment_path',
        'description',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'direction' => CashTransactionDirection::class,
            'payment_method' => PaymentMethod::class,
            'amount' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function expenseCategory(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function scopeBetweenDates(Builder $query, ?string $from, ?string $to): Builder
    {
        return $query
            ->when($from, fn (Builder $builder) => $builder->whereDate('transaction_date', '>=', $from))
            ->when($to, fn (Builder $builder) => $builder->whereDate('transaction_date', '<=', $to));
    }
}
