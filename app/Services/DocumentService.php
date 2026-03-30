<?php

namespace App\Services;

use App\Models\Document;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DocumentService
{
    public function __construct(
        private readonly AuditLogService $auditLogService,
    ) {
    }

    public function store(array $data, UploadedFile $file, User $user): Document
    {
        return DB::transaction(function () use ($data, $file, $user): Document {
            $disk = $data['disk'] ?? 'public';
            $path = $file->store('documents', $disk);

            $document = Document::query()->create([
                'branch_id' => $data['branch_id'] ?? $user->branch_id,
                'uploaded_by' => $user->id,
                'customer_id' => $data['customer_id'] ?? null,
                'supplier_id' => $data['supplier_id'] ?? null,
                'sale_id' => $data['sale_id'] ?? null,
                'purchase_id' => $data['purchase_id'] ?? null,
                'invoice_id' => $data['invoice_id'] ?? null,
                'cash_transaction_id' => $data['cash_transaction_id'] ?? null,
                'title' => $data['title'],
                'document_type' => $data['document_type'],
                'reference_number' => $data['reference_number'] ?? null,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'disk' => $disk,
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'document_date' => $data['document_date'] ?? null,
                'expiry_date' => $data['expiry_date'] ?? null,
                'description' => $data['description'] ?? null,
                'metadata' => $data['metadata'] ?? null,
            ]);

            if (! empty($data['tag_ids'])) {
                $document->syncTagsByIds($data['tag_ids']);
            }

            $this->auditLogService->log(
                event: 'document.created',
                description: "Document {$document->title} uploaded",
                auditable: $document,
                newValues: $document->toArray(),
                user: $user,
                branchId: $document->branch_id,
            );

            return $document->load(['tags', 'customer', 'supplier']);
        });
    }
}
