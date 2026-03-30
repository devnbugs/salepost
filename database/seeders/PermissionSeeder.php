<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Support\PermissionMatrix;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (PermissionMatrix::permissions() as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        foreach (UserRole::cases() as $roleEnum) {
            $role = Role::findOrCreate($roleEnum->value, 'web');
            $role->syncPermissions(PermissionMatrix::permissionsForRole($roleEnum));
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
