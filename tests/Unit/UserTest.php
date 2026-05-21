<?php

use App\Models\Branch;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->branch = Branch::create([
        'name' => 'Kano Branch',
        'code' => 'BR-01',
        'phone' => '123456',
        'email' => 'kano@example.com',
        'address' => 'Kano, Nigeria',
        'is_default' => true,
        'is_active' => true,
    ]);

    $this->superAdminRole = Role::create([
        'name' => 'Super Admin',
        'slug' => 'super-admin',
    ]);

    $this->operatorRole = Role::create([
        'name' => 'Operator',
        'slug' => 'operator',
    ]);
});

test('isOwner returns true for super admin role or Owner job title', function () {
    $userWithRole = User::factory()->create([
        'role_id' => $this->superAdminRole->id,
        'branch_id' => $this->branch->id,
        'job_title' => 'Manager',
    ]);

    $userWithJobTitle = User::factory()->create([
        'role_id' => $this->operatorRole->id,
        'branch_id' => $this->branch->id,
        'job_title' => 'Owner',
    ]);

    $regularUser = User::factory()->create([
        'role_id' => $this->operatorRole->id,
        'branch_id' => $this->branch->id,
        'job_title' => 'Operator',
    ]);

    expect($userWithRole->isOwner())->toBeTrue();
    expect($userWithJobTitle->isOwner())->toBeTrue();
    expect($regularUser->isOwner())->toBeFalse();
});

test('hasPermission returns true for owners always', function () {
    $owner = User::factory()->create([
        'role_id' => $this->superAdminRole->id,
        'branch_id' => $this->branch->id,
    ]);

    expect($owner->hasPermission('any_random_permission'))->toBeTrue();
});

test('hasPermission returns false for inactive users', function () {
    $permission = Permission::create([
        'name' => 'Manage Sales',
        'slug' => 'manage_sales',
    ]);

    $this->operatorRole->permissions()->attach($permission->id);

    $inactiveUser = User::factory()->create([
        'role_id' => $this->operatorRole->id,
        'branch_id' => $this->branch->id,
        'is_active' => false,
    ]);

    expect($inactiveUser->hasPermission('manage_sales'))->toBeFalse();
});

test('hasPermission checks role permissions for active regular users', function () {
    $permission = Permission::create([
        'name' => 'Manage Sales',
        'slug' => 'manage_sales',
    ]);

    $this->operatorRole->permissions()->attach($permission->id);

    $activeUser = User::factory()->create([
        'role_id' => $this->operatorRole->id,
        'branch_id' => $this->branch->id,
        'is_active' => true,
    ]);

    expect($activeUser->hasPermission('manage_sales'))->toBeTrue();
    expect($activeUser->hasPermission('delete_users'))->toBeFalse();
});
