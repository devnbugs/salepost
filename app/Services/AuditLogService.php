<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AuditLogService
{
    public function log(
        string $event,
        string $description,
        ?Model $auditable = null,
        array $oldValues = [],
        array $newValues = [],
        array $metadata = [],
        ?User $user = null,
        ?int $branchId = null,
    ): AuditLog {
        $request = app()->runningInConsole() ? null : request();

        return AuditLog::query()->create([
            'branch_id' => $branchId ?? $user?->branch_id,
            'user_id' => $user?->id,
            'event' => $event,
            'description' => $description,
            'auditable_type' => $auditable?->getMorphClass(),
            'auditable_id' => $auditable?->getKey(),
            'old_values' => $oldValues ?: null,
            'new_values' => $newValues ?: null,
            'metadata' => $metadata ?: null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'url' => $request?->fullUrl(),
            'method' => $request?->method(),
        ]);
    }
}
