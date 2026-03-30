<?php

namespace App\Models;

use App\Enums\CashTransactionDirection;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'invoice_id',
        'sale_id',
        'purchase_id',
        'customer_id',
        'supplier_id',
        'cash_transaction_id',
        'recorded_by',
        'payment_number',
        'payment_date',
        'direction',
        'status',
        'method',
        'amount',
        'reference_number',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date',
            'direction' => CashTransactionDirection::class,
            'method' => PaymentMethod::class,
            'amount' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function cashTransaction(): BelongsTo
    {
        return $this->belongsTo(CashTransaction::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
