<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\ExpenseCategory;
use App\Models\ProductCategory;
use App\Services\SettingsService;
use Illuminate\Database\Seeder;

class BusinessSetupSeeder extends Seeder
{
    public function run(): void
    {
        $mainBranch = Branch::query()->updateOrCreate(
            ['code' => 'KAN'],
            [
                'name' => 'Kano Main Yard',
                'phone' => '+234 803 555 0101',
                'email' => 'kano@salepost.ng',
                'address' => 'No. 18 Zoo Road, Kano, Nigeria',
                'is_default' => true,
                'is_active' => true,
                'metadata' => ['label' => 'Primary operating branch'],
            ],
        );

        Branch::query()->updateOrCreate(
            ['code' => 'KAD'],
            [
                'name' => 'Kaduna Collection Point',
                'phone' => '+234 803 555 0102',
                'email' => 'kaduna@salepost.ng',
                'address' => 'Plot 7 Independence Way, Kaduna, Nigeria',
                'is_default' => false,
                'is_active' => true,
                'metadata' => ['label' => 'Branch-ready sample location'],
            ],
        );

        foreach ([
            [
                'name' => 'Ferrous Metals',
                'slug' => 'ferrous-metals',
                'description' => 'Heavy iron and steel scrap materials.',
            ],
            [
                'name' => 'Non-Ferrous Metals',
                'slug' => 'non-ferrous-metals',
                'description' => 'High-value non-ferrous scrap such as brass, copper, and aluminium.',
            ],
            [
                'name' => 'Wire Scrap',
                'slug' => 'wire-scrap',
                'description' => 'Insulated and stripped wire materials including Jar Waya.',
            ],
            [
                'name' => 'Battery Scrap',
                'slug' => 'battery-scrap',
                'description' => 'Battery units and related battery recovery materials.',
            ],
            [
                'name' => 'Mixed Materials',
                'slug' => 'mixed-materials',
                'description' => 'Mixed grades and assorted metal recovery items.',
            ],
        ] as $category) {
            ProductCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'is_active' => true,
                ],
            );
        }

        foreach ([
            [
                'name' => 'Customer Payment',
                'slug' => 'customer-payment',
                'type' => 'cash_in',
                'description' => 'Cash and transfer inflows received from customers.',
            ],
            [
                'name' => 'Other Income',
                'slug' => 'other-income',
                'type' => 'cash_in',
                'description' => 'Miscellaneous business inflows not tied to invoices.',
            ],
            [
                'name' => 'Supplier Payment',
                'slug' => 'supplier-payment',
                'type' => 'cash_out',
                'description' => 'Cash paid to suppliers for scrap intake.',
            ],
            [
                'name' => 'Transport',
                'slug' => 'transport',
                'type' => 'cash_out',
                'description' => 'Haulage, loading, and delivery expenses.',
            ],
            [
                'name' => 'Fuel',
                'slug' => 'fuel',
                'type' => 'cash_out',
                'description' => 'Fuel purchases for vehicles and generators.',
            ],
            [
                'name' => 'Maintenance',
                'slug' => 'maintenance',
                'type' => 'cash_out',
                'description' => 'Machine and vehicle repair expenses.',
            ],
            [
                'name' => 'Salary / Allowance',
                'slug' => 'salary-allowance',
                'type' => 'cash_out',
                'description' => 'Staff salaries and operational allowances.',
            ],
            [
                'name' => 'Operational Expense',
                'slug' => 'operational-expense',
                'type' => 'cash_out',
                'description' => 'General running costs and small cash expenses.',
            ],
            [
                'name' => 'Miscellaneous Expense',
                'slug' => 'miscellaneous-expense',
                'type' => 'cash_out',
                'description' => 'Other cash outflows requiring record keeping.',
            ],
        ] as $expenseCategory) {
            ExpenseCategory::query()->updateOrCreate(
                ['slug' => $expenseCategory['slug']],
                [
                    'name' => $expenseCategory['name'],
                    'type' => $expenseCategory['type'],
                    'description' => $expenseCategory['description'],
                    'is_active' => true,
                ],
            );
        }

        /** @var SettingsService $settings */
        $settings = app(SettingsService::class);

        $settings->setGroup('business', [
            'business_name' => 'Salepost Metals & Scrap Resources',
            'business_address' => 'No. 18 Zoo Road, Kano, Nigeria',
            'phone' => '+234 803 555 0101',
            'email' => 'owner@salepost.ng',
            'currency' => 'NGN',
            'invoice_prefix' => 'SLP',
            'allow_negative_stock' => false,
        ], null);

        $settings->setGroup('theme', [
            'default_theme' => 'system',
        ], null);

        $settings->setGroup('business', [
            'business_name' => 'Salepost Metals & Scrap Resources',
            'business_address' => 'No. 18 Zoo Road, Kano, Nigeria',
            'phone' => $mainBranch->phone,
            'email' => 'owner@salepost.ng',
            'currency' => 'NGN',
            'invoice_prefix' => 'SLP',
            'allow_negative_stock' => false,
        ], $mainBranch->id);
    }
}
