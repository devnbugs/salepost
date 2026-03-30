<?php

namespace Database\Seeders;

use App\Enums\ThemePreference;
use App\Enums\UserRole;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $branch = Branch::query()->where('code', 'KAN')->firstOrFail();

        foreach ([
            [
                'name' => 'Abdul Salisu',
                'email' => 'owner@salepost.ng',
                'phone' => '+234 803 555 0101',
                'job_title' => 'Owner',
                'role' => UserRole::Owner,
                'theme_preference' => ThemePreference::System->value,
            ],
            [
                'name' => 'Mariam Yusuf',
                'email' => 'manager@salepost.ng',
                'phone' => '+234 803 555 0103',
                'job_title' => 'Operations Manager',
                'role' => UserRole::Manager,
                'theme_preference' => ThemePreference::Light->value,
            ],
            [
                'name' => 'Chinonso Eze',
                'email' => 'cashier@salepost.ng',
                'phone' => '+234 803 555 0104',
                'job_title' => 'Cashier / Account Officer',
                'role' => UserRole::Cashier,
                'theme_preference' => ThemePreference::System->value,
            ],
            [
                'name' => 'Bashir Lawal',
                'email' => 'sales@salepost.ng',
                'phone' => '+234 803 555 0105',
                'job_title' => 'Sales Staff',
                'role' => UserRole::SalesStaff,
                'theme_preference' => ThemePreference::Dark->value,
            ],
            [
                'name' => 'Rabiu Sani',
                'email' => 'storekeeper@salepost.ng',
                'phone' => '+234 803 555 0106',
                'job_title' => 'Storekeeper',
                'role' => UserRole::Storekeeper,
                'theme_preference' => ThemePreference::System->value,
            ],
            [
                'name' => 'Fatima Bello',
                'email' => 'auditor@salepost.ng',
                'phone' => '+234 803 555 0107',
                'job_title' => 'Viewer / Auditor',
                'role' => UserRole::Viewer,
                'theme_preference' => ThemePreference::Light->value,
            ],
        ] as $record) {
            $user = User::query()->updateOrCreate(
                ['email' => $record['email']],
                [
                    'branch_id' => $branch->id,
                    'name' => $record['name'],
                    'phone' => $record['phone'],
                    'job_title' => $record['job_title'],
                    'theme_preference' => $record['theme_preference'],
                    'is_active' => true,
                    'two_factor_enabled' => false,
                    'password' => 'password',
                    'email_verified_at' => now(),
                ],
            );

            $user->syncRoles([$record['role']->value]);
        }
    }
}
