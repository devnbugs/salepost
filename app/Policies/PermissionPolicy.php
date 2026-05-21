<?php

namespace App\Policies;

use App\Models\User;

abstract class PermissionPolicy
{
    protected string $permissionPrefix;

    public function viewAny(User $user): bool
    {
        return $user->hasPermission("view_any_{$this->permissionPrefix}");
    }

    public function view(User $user, mixed $model): bool
    {
        return $user->hasPermission("view_{$this->permissionPrefix}");
    }

    public function create(User $user): bool
    {
        return $user->hasPermission("create_{$this->permissionPrefix}");
    }

    public function update(User $user, mixed $model): bool
    {
        return $user->hasPermission("update_{$this->permissionPrefix}");
    }

    public function delete(User $user, mixed $model): bool
    {
        return $user->hasPermission("delete_{$this->permissionPrefix}");
    }
}
