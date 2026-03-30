<?php

namespace App\Models;

use App\Enums\DocumentType;
use App\Models\Concerns\InteractsWithTags;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentFactory> */
    use HasFactory, InteractsWithTags, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'uploaded_by',
        'customer_id',
        'supplier_id',
        'sale_id',
        'purchase_id',
        'invoice_id',
        'cash_transaction_id',
        'title',
        'document_type',
        'reference_number',
        'file_name',
        'file_path',
        'disk',
        'mime_type',
        'file_size',
        'document_date',
        'expiry_date',
        'description',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'document_type' => DocumentType::class,
            'document_date' => 'date',
            'expiry_date' => 'date',
            'metadata' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
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

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function cashTransaction(): BelongsTo
    {
        return $this->belongsTo(CashTransaction::class);
    }
}
