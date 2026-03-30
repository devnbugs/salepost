<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    /** @use HasFactory<\Database\Factories\InvoiceFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'sale_id',
        'customer_id',
        'issued_by',
        'invoice_number',
        'invoice_date',
        'due_date',
        'status',
        'currency',
        'subtotal',
        'charges_total',
        'total_amount',
        'amount_paid',
        'balance_due',
        'pdf_path',
        'notes',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'invoice_date' => 'date',
            'due_date' => 'date',
            'status' => InvoiceStatus::class,
            'subtotal' => 'decimal:2',
            'charges_total' => 'decimal:2',
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

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
