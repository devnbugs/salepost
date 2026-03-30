<?php

namespace App\Services;

use App\Enums\StockMovementType;
use App\Events\StockAdjusted;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    public function __construct(
        private readonly SettingsService $settingsService,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    public function adjust(
        Product $product,
        float $quantityDelta,
        StockMovementType $type,
        User $user,
        ?Model $source = null,
        ?string $notes = null,
        ?string $referenceNumber = null,
        array $metadata = [],
    ): StockMovement {
        return DB::transaction(function () use ($product, $quantityDelta, $type, $user, $source, $notes, $referenceNumber, $metadata): StockMovement {
            $lockedProduct = Product::query()->lockForUpdate()->findOrFail($product->id);
            $before = (float) $lockedProduct->current_stock;
            $after = round($before + $quantityDelta, 3);
            $allowNegativeStock = (bool) $this->settingsService->get('business', 'allow_negative_stock', false, $lockedProduct->branch_id);

            if ($after < 0 && ! $allowNegativeStock) {
                throw ValidationException::withMessages([
                    'items' => ["Insufficient stock for {$lockedProduct->name}. Available stock is {$lockedProduct->current_stock} {$lockedProduct->unit_of_measure}."],
                ]);
            }

            $lockedProduct->forceFill([
                'current_stock' => $after,
            ])->save();

            $movement = StockMovement::query()->create([
                'branch_id' => $lockedProduct->branch_id,
                'product_id' => $lockedProduct->id,
                'user_id' => $user->id,
                'type' => $type,
                'quantity' => $quantityDelta,
                'quantity_before' => $before,
                'quantity_after' => $after,
                'reference_number' => $referenceNumber,
                'movement_date' => now(),
                'notes' => $notes,
                'metadata' => $metadata ?: null,
                'source_type' => $source?->getMorphClass(),
                'source_id' => $source?->getKey(),
            ]);

            $this->auditLogService->log(
                event: 'stock.adjusted',
                description: "Stock adjusted for {$lockedProduct->name}",
                auditable: $movement,
                newValues: $movement->toArray(),
                metadata: ['product_id' => $lockedProduct->id],
                user: $user,
                branchId: $lockedProduct->branch_id,
            );

            event(new StockAdjusted($movement));

            return $movement;
        });
    }
}
