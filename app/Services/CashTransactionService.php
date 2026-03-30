<?php

namespace App\Services;

use App\Enums\CashTransactionDirection;
use App\Models\CashTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CashTransactionService
{
    public function __construct(
        private readonly NumberGeneratorService $numberGeneratorService,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    public function record(array $data, User $user): CashTransaction
    {
        return DB::transaction(function () use ($data, $user): CashTransaction {
            $branchId = $data['branch_id'] ?? $user->branch_id;

            $transaction = CashTransaction::query()->create([
                'branch_id' => $branchId,
                'expense_category_id' => $data['expense_category_id'] ?? null,
                'customer_id' => $data['customer_id'] ?? null,
                'supplier_id' => $data['supplier_id'] ?? null,
                'sale_id' => $data['sale_id'] ?? null,
                'purchase_id' => $data['purchase_id'] ?? null,
                'recorded_by' => $user->id,
                'transaction_number' => $this->numberGeneratorService->nextCashTransactionNumber($branchId),
                'transaction_date' => $data['transaction_date'] ?? now()->toDateString(),
                'direction' => $data['direction'] ?? CashTransactionDirection::Inflow->value,
                'category_name' => $data['category_name'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'amount' => $data['amount'],
                'reference_number' => $data['reference_number'] ?? null,
                'attachment_path' => $data['attachment_path'] ?? null,
                'description' => $data['description'] ?? null,
                'metadata' => $data['metadata'] ?? null,
            ]);

            if (! empty($data['tag_ids'])) {
                $transaction->syncTagsByIds($data['tag_ids']);
            }

            $this->auditLogService->log(
                event: 'cash_transaction.created',
                description: "Cash transaction {$transaction->transaction_number} recorded",
                auditable: $transaction,
                newValues: $transaction->toArray(),
                user: $user,
                branchId: $branchId,
            );

            return $transaction->load(['expenseCategory', 'customer', 'supplier']);
        });
    }
}
