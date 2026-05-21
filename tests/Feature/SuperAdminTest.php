<?php

use App\Models\Branch;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    // Set up default branch
    $this->branch = Branch::create([
        'name' => 'Kano Branch',
        'code' => 'BR-01',
        'phone' => '123456',
        'email' => 'kano@example.com',
        'address' => 'Kano, Nigeria',
        'is_default' => true,
        'is_active' => true,
    ]);

    // Set up default roles
    $this->superAdminRole = Role::create([
        'name' => 'Super Admin',
        'slug' => 'super-admin',
    ]);

    $this->operatorRole = Role::create([
        'name' => 'Operator',
        'slug' => 'operator',
    ]);

    // Create a Super Admin user
    $this->superAdminUser = User::factory()->create([
        'name' => 'Super Admin User',
        'email' => 'admin@example.com',
        'role_id' => $this->superAdminRole->id,
        'branch_id' => $this->branch->id,
        'job_title' => 'Owner',
        'is_active' => true,
    ]);

    // Create a regular Operator user
    $this->operatorUser = User::factory()->create([
        'name' => 'Operator User',
        'email' => 'operator@example.com',
        'role_id' => $this->operatorRole->id,
        'branch_id' => $this->branch->id,
        'job_title' => 'Operator',
        'is_active' => true,
    ]);
});

test('guests and non-owners are forbidden from visiting the super admin dashboard', function () {
    // Guest
    $this->get(route('super-admin.dashboard'))
        ->assertRedirect(route('login'));

    // Non-owner / Operator
    $this->actingAs($this->operatorUser);
    $this->get(route('super-admin.dashboard'))
        ->assertForbidden();
});

test('super admin can visit the super admin dashboard', function () {
    $this->actingAs($this->superAdminUser);

    $response = $this->get(route('super-admin.dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('super-admin/dashboard')
        ->has('users')
        ->has('branches')
        ->has('roles')
        ->has('permissions')
    );
});

test('super admin can register a new user', function () {
    $this->actingAs($this->superAdminUser);

    $response = $this->post(route('super-admin.users.store'), [
        'name' => 'New User Name',
        'email' => 'newuser@example.com',
        'password' => 'secret-password-123',
        'role_id' => $this->operatorRole->id,
        'branch_id' => $this->branch->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'name' => 'New User Name',
        'email' => 'newuser@example.com',
        'role_id' => $this->operatorRole->id,
        'branch_id' => $this->branch->id,
        'job_title' => 'Operator',
        'is_active' => true,
    ]);
});

test('super admin can update user details and toggle active status', function () {
    $this->actingAs($this->superAdminUser);

    // Update details and deactivate
    $response = $this->patch(route('super-admin.users.update', ['user' => $this->operatorUser->id]), [
        'name' => 'Modified Operator Name',
        'email' => 'operator@example.com',
        'role_id' => $this->superAdminRole->id, // Promote to super admin
        'branch_id' => $this->branch->id,
        'is_active' => false, // Suspend account
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $this->operatorUser->id,
        'name' => 'Modified Operator Name',
        'role_id' => $this->superAdminRole->id,
        'is_active' => false,
    ]);
});

test('super admin cannot delete themselves but can delete other users', function () {
    $this->actingAs($this->superAdminUser);

    // Self-deletion check
    $response = $this->delete(route('super-admin.users.destroy', ['user' => $this->superAdminUser->id]));
    $response->assertStatus(400);
    $this->assertDatabaseHas('users', ['id' => $this->superAdminUser->id]);

    // Deleting other operator check
    $response = $this->delete(route('super-admin.users.destroy', ['user' => $this->operatorUser->id]));
    $response->assertRedirect();
    $this->assertDatabaseMissing('users', ['id' => $this->operatorUser->id]);
});

test('super admin can sync role permissions', function () {
    $this->actingAs($this->superAdminUser);

    $perm1 = Permission::create(['name' => 'View Users', 'slug' => 'view_users']);
    $perm2 = Permission::create(['name' => 'Create Users', 'slug' => 'create_users']);

    // Sync only perm1 with the operator role
    $response = $this->post(route('super-admin.roles.permissions.sync', ['role' => $this->operatorRole->id]), [
        'permission_ids' => [$perm1->id],
    ]);

    $response->assertRedirect();
    $this->assertTrue($this->operatorRole->permissions()->where('permissions.id', $perm1->id)->exists());
    $this->assertFalse($this->operatorRole->permissions()->where('permissions.id', $perm2->id)->exists());
});
