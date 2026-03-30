<?php

namespace Tests;

use App\Enums\UserRole;
use App\Models\Branch;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Spatie\Permission\PermissionRegistrar;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    protected function createUserWithRole(UserRole $role, ?Branch $branch = null): User
    {
        $this->seed(PermissionSeeder::class);

        $user = User::factory()->create([
            'branch_id' => $branch?->id ?? Branch::factory(),
        ]);

        $user->assignRole($role->value);

        return $user;
    }
}
