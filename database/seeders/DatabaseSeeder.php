<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create default and secondary branches
        $branch = Branch::firstOrCreate(
            ['code' => 'BR-01'],
            [
                'name' => 'Main Branch',
                'phone' => '1234567890',
                'email' => 'main@example.com',
                'address' => '123 Main St',
                'is_default' => true,
                'is_active' => true,
            ]
        );

        $kanoBranch = Branch::firstOrCreate(
            ['code' => 'KANO-01'],
            [
                'name' => 'Kano Main Yard',
                'phone' => '08031234567',
                'email' => 'kano@salepost.example.com',
                'address' => 'Kano Industrial Layout, Kano State, Nigeria',
                'is_default' => false,
                'is_active' => true,
            ]
        );

        $lagosBranch = Branch::firstOrCreate(
            ['code' => 'LAGOS-02'],
            [
                'name' => 'Lagos Hub',
                'phone' => '08029876543',
                'email' => 'lagos@salepost.example.com',
                'address' => 'Apapa Wharf Rd, Lagos State, Nigeria',
                'is_default' => false,
                'is_active' => true,
            ]
        );

        // 2. Create Roles
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'super-admin'],
            ['name' => 'Super Admin']
        );

        $operatorRole = Role::firstOrCreate(
            ['slug' => 'operator'],
            ['name' => 'Operator']
        );

        // 3. Define Resource Prefixes and Actions for Permissions
        $prefixes = [
            'users' => 'Users',
            'sales' => 'Sales',
            'purchases' => 'Purchases',
            'customers' => 'Customers',
            'suppliers' => 'Suppliers',
            'invoices' => 'Invoices',
            'settings' => 'Settings',
            'documents' => 'Documents',
            'cash_transactions' => 'Cash Transactions',
            'products' => 'Products',
        ];

        $actions = [
            'view_any' => 'View Any',
            'view' => 'View',
            'create' => 'Create',
            'update' => 'Update',
            'delete' => 'Delete',
        ];

        // 4. Seed Permissions
        $allPermissionIds = [];
        $operatorPermissionIds = [];

        foreach ($prefixes as $prefix => $prefixName) {
            foreach ($actions as $action => $actionName) {
                $slug = "{$action}_{$prefix}";
                $name = "{$actionName} {$prefixName}";

                $permission = Permission::firstOrCreate(
                    ['slug' => $slug],
                    ['name' => $name]
                );

                $allPermissionIds[] = $permission->id;

                // Define some basic permissions for the Operator role
                if (in_array($prefix, ['sales', 'purchases', 'customers', 'suppliers', 'products', 'documents'])) {
                    if (in_array($action, ['view_any', 'view', 'create', 'update'])) {
                        $operatorPermissionIds[] = $permission->id;
                    }
                }
            }
        }

        // 5. Sync permissions with Roles
        $superAdminRole->permissions()->sync($allPermissionIds);
        $operatorRole->permissions()->sync($operatorPermissionIds);

        // 6. Create or update Test Users
        $usersToSeed = [
            [
                'email' => 'test@example.com',
                'name' => 'Test User',
                'role_id' => $superAdminRole->id,
                'job_title' => 'Owner',
                'branch_id' => $branch->id,
            ],
            [
                'email' => 'admin@example.com',
                'name' => 'Admin Commander',
                'role_id' => $superAdminRole->id,
                'job_title' => 'Owner',
                'branch_id' => $branch->id,
            ],
            [
                'email' => 'operator@example.com',
                'name' => 'Operator User',
                'role_id' => $operatorRole->id,
                'job_title' => 'Operator',
                'branch_id' => $branch->id,
            ],
            [
                'email' => 'kano_operator@example.com',
                'name' => 'Kano Yard Manager',
                'role_id' => $operatorRole->id,
                'job_title' => 'Yard Supervisor',
                'branch_id' => $kanoBranch->id,
            ],
            [
                'email' => 'lagos_operator@example.com',
                'name' => 'Lagos Yard Manager',
                'role_id' => $operatorRole->id,
                'job_title' => 'Logistics Supervisor',
                'branch_id' => $lagosBranch->id,
            ],
        ];

        foreach ($usersToSeed as $userData) {
            $user = User::where('email', $userData['email'])->first();
            if ($user) {
                $user->update([
                    'name' => $userData['name'],
                    'branch_id' => $userData['branch_id'],
                    'role_id' => $userData['role_id'],
                    'job_title' => $userData['job_title'],
                    'is_active' => true,
                ]);
            } else {
                User::factory()->create([
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => Hash::make('password'),
                    'branch_id' => $userData['branch_id'],
                    'role_id' => $userData['role_id'],
                    'job_title' => $userData['job_title'],
                    'is_active' => true,
                ]);
            }
        }

        // 7. Seed Default Settings
        $defaultSettings = [
            [
                'key' => 'maintenance_mode',
                'group' => 'general',
                'label' => 'Maintenance Mode',
                'type' => 'boolean',
                'value' => 'false',
                'is_public' => false,
            ],
            [
                'key' => 'allow_registrations',
                'group' => 'general',
                'label' => 'Allow New Registrations',
                'type' => 'boolean',
                'value' => 'true',
                'is_public' => true,
            ],
            [
                'key' => 'two_factor_auth',
                'group' => 'general',
                'label' => 'Enforce Two-Factor Authentication',
                'type' => 'boolean',
                'value' => 'false',
                'is_public' => false,
            ],
            [
                'key' => 'company_name',
                'group' => 'general',
                'label' => 'Company Name',
                'type' => 'string',
                'value' => 'Salepost Corp',
                'is_public' => true,
            ],
            [
                'key' => 'support_email',
                'group' => 'general',
                'label' => 'Support Email',
                'type' => 'string',
                'value' => 'support@salepost.example.com',
                'is_public' => true,
            ],
        ];

        foreach ($defaultSettings as $setting) {
            Setting::firstOrCreate(
                ['group' => $setting['group'], 'key' => $setting['key']],
                [
                    'label' => $setting['label'],
                    'type' => $setting['type'],
                    'value' => $setting['value'],
                    'is_public' => $setting['is_public'],
                ]
            );
        }
    }
}
