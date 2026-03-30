<?php

namespace Database\Seeders;

use App\Enums\CashTransactionDirection;
use App\Enums\DocumentType;
use App\Enums\PaymentMethod;
use App\Enums\ProductStatus;
use App\Enums\PurchaseStatus;
use App\Enums\SaleStatus;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Document;
use App\Models\ExpenseCategory;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\Tag;
use App\Models\User;
use App\Services\AuditLogService;
use App\Services\CashTransactionService;
use App\Services\PaymentService;
use App\Services\PurchaseService;
use App\Services\SaleService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        config()->set('queue.default', 'sync');

        $branch = Branch::query()->where('code', 'KAN')->firstOrFail();
        $owner = User::query()->where('email', 'owner@salepost.ng')->firstOrFail();
        $cashier = User::query()->where('email', 'cashier@salepost.ng')->firstOrFail();
        $salesStaff = User::query()->where('email', 'sales@salepost.ng')->firstOrFail();
        $storekeeper = User::query()->where('email', 'storekeeper@salepost.ng')->firstOrFail();

        $tags = collect([
            ['name' => 'Wholesale', 'slug' => 'wholesale', 'color' => '#0f766e'],
            ['name' => 'Transport', 'slug' => 'transport', 'color' => '#1d4ed8'],
            ['name' => 'Bank Transfer', 'slug' => 'bank-transfer', 'color' => '#475569'],
            ['name' => 'Yard Intake', 'slug' => 'yard-intake', 'color' => '#b45309'],
            ['name' => 'Urgent', 'slug' => 'urgent', 'color' => '#be123c'],
            ['name' => 'Repeat Customer', 'slug' => 'repeat-customer', 'color' => '#0f766e'],
        ])->mapWithKeys(function (array $tag) use ($owner) {
            $model = Tag::query()->updateOrCreate(
                ['slug' => $tag['slug']],
                [
                    'name' => $tag['name'],
                    'color' => $tag['color'],
                    'description' => "{$tag['name']} sample tag",
                    'created_by' => $owner->id,
                ],
            );

            return [$tag['slug'] => $model];
        });

        $categories = ProductCategory::query()->get()->keyBy('slug');

        $products = collect([
            [
                'name' => 'Karfe',
                'slug' => 'karfe',
                'category' => 'ferrous-metals',
                'description' => 'Heavy iron and steel scrap sourced from demolition and fabrication yards.',
                'unit_of_measure' => 'kg',
                'cost_price' => 420,
                'selling_price' => 650,
                'reorder_level' => 250,
                'notes' => 'Fast-moving ferrous material.',
            ],
            [
                'name' => 'Brass',
                'slug' => 'brass',
                'category' => 'non-ferrous-metals',
                'description' => 'Sorted brass valves, taps, and mixed yellow metal scrap.',
                'unit_of_measure' => 'kg',
                'cost_price' => 3200,
                'selling_price' => 4100,
                'reorder_level' => 200,
                'notes' => 'Premium resale margin item.',
            ],
            [
                'name' => 'Jar Waya',
                'slug' => 'jar-waya',
                'category' => 'wire-scrap',
                'description' => 'Recovered copper wire and stripped cable bundles.',
                'unit_of_measure' => 'kg',
                'cost_price' => 1550,
                'selling_price' => 2300,
                'reorder_level' => 120,
                'notes' => 'Usually sold in bundles or per kilogram.',
            ],
            [
                'name' => 'Aluminium',
                'slug' => 'aluminium',
                'category' => 'non-ferrous-metals',
                'description' => 'Mixed aluminium profile, pots, and extrusion scrap.',
                'unit_of_measure' => 'kg',
                'cost_price' => 1650,
                'selling_price' => 2500,
                'reorder_level' => 150,
                'notes' => 'Stable demand from foundry buyers.',
            ],
            [
                'name' => 'Copper',
                'slug' => 'copper',
                'category' => 'non-ferrous-metals',
                'description' => 'Clean copper pieces and high-grade cable recovery material.',
                'unit_of_measure' => 'kg',
                'cost_price' => 5100,
                'selling_price' => 6500,
                'reorder_level' => 80,
                'notes' => 'High-value material with strict handling.',
            ],
            [
                'name' => 'Battery Scrap',
                'slug' => 'battery-scrap',
                'category' => 'battery-scrap',
                'description' => 'Used batteries awaiting safe recovery and disposal processing.',
                'unit_of_measure' => 'piece',
                'cost_price' => 2600,
                'selling_price' => 4200,
                'reorder_level' => 40,
                'notes' => 'Handle with protective gear.',
            ],
            [
                'name' => 'Mixed Metals',
                'slug' => 'mixed-metals',
                'category' => 'mixed-materials',
                'description' => 'Assorted metal mix from site clear-outs and yard sorting.',
                'unit_of_measure' => 'kg',
                'cost_price' => 1200,
                'selling_price' => 1700,
                'reorder_level' => 180,
                'notes' => 'Requires sorting before dispatch.',
            ],
        ])->mapWithKeys(function (array $product) use ($branch, $categories) {
            $model = Product::query()->updateOrCreate(
                [
                    'branch_id' => $branch->id,
                    'slug' => $product['slug'],
                ],
                [
                    'product_category_id' => $categories[$product['category']]->id ?? null,
                    'name' => $product['name'],
                    'sku' => strtoupper(Str::replace('-', '', $product['slug'])).'-001',
                    'description' => $product['description'],
                    'unit_of_measure' => $product['unit_of_measure'],
                    'cost_price' => $product['cost_price'],
                    'selling_price' => $product['selling_price'],
                    'current_stock' => 0,
                    'reorder_level' => $product['reorder_level'],
                    'status' => ProductStatus::Active->value,
                    'notes' => $product['notes'],
                    'metadata' => ['seeded' => true],
                ],
            );

            return [$product['slug'] => $model];
        });

        $customers = collect([
            [
                'name' => 'Aisha Metal Works',
                'phone' => '+234 803 600 1001',
                'email' => 'orders@aishametal.ng',
                'company_name' => 'Aisha Metal Works',
                'address' => 'Sharada Industrial Layout, Kano',
                'notes' => 'Buys sorted ferrous and wire scrap weekly.',
            ],
            [
                'name' => 'Northern Recyclers Ltd',
                'phone' => '+234 803 600 1002',
                'email' => 'procurement@northernrecyclers.ng',
                'company_name' => 'Northern Recyclers Ltd',
                'address' => 'Hotoro Ring Road, Kano',
                'notes' => 'Prefers bank transfer settlements.',
            ],
            [
                'name' => 'Dala Construction Supplies',
                'phone' => '+234 803 600 1003',
                'email' => 'buying@dalaconstruction.ng',
                'company_name' => 'Dala Construction Supplies',
                'address' => 'Bompai, Kano',
                'notes' => 'Occasional bulk buyer for karfe.',
            ],
            [
                'name' => 'Kano Foundry Works',
                'phone' => '+234 803 600 1004',
                'email' => 'sales@kanofoundry.ng',
                'company_name' => 'Kano Foundry Works',
                'address' => 'Zaria Road, Kano',
                'notes' => 'Takes brass, aluminium, and copper.',
            ],
            [
                'name' => 'Sabon Gari Traders',
                'phone' => '+234 803 600 1005',
                'email' => null,
                'company_name' => null,
                'address' => 'Sabon Gari Market, Kano',
                'notes' => 'Walk-in repeat buyer.',
            ],
        ])->mapWithKeys(function (array $customer) use ($branch) {
            $model = Customer::query()->updateOrCreate(
                [
                    'branch_id' => $branch->id,
                    'name' => $customer['name'],
                ],
                [
                    'phone' => $customer['phone'],
                    'email' => $customer['email'],
                    'company_name' => $customer['company_name'],
                    'address' => $customer['address'],
                    'balance' => 0,
                    'notes' => $customer['notes'],
                    'is_active' => true,
                    'metadata' => ['seeded' => true],
                ],
            );

            return [$customer['name'] => $model];
        });

        $suppliers = collect([
            [
                'name' => 'Musa Yard Suppliers',
                'phone' => '+234 803 700 2001',
                'email' => 'musa.yard@example.com',
                'address' => 'Dakata, Kano',
                'materials_supplied' => ['Karfe', 'Jar Waya'],
                'notes' => 'Reliable for weekly ferrous loads.',
            ],
            [
                'name' => 'Zaria Cable Recovery',
                'phone' => '+234 803 700 2002',
                'email' => 'zariacable@example.com',
                'address' => 'Zaria, Kaduna State',
                'materials_supplied' => ['Jar Waya', 'Copper', 'Aluminium'],
                'notes' => 'Supplies stripped and mixed cable.',
            ],
            [
                'name' => 'Arewa Metal Aggregators',
                'phone' => '+234 803 700 2003',
                'email' => 'arewametal@example.com',
                'address' => 'Katsina Road, Kano',
                'materials_supplied' => ['Brass', 'Mixed Metals', 'Battery Scrap'],
                'notes' => 'Bulk mixed-material supplier.',
            ],
        ])->mapWithKeys(function (array $supplier) use ($branch) {
            $model = Supplier::query()->updateOrCreate(
                [
                    'branch_id' => $branch->id,
                    'name' => $supplier['name'],
                ],
                [
                    'phone' => $supplier['phone'],
                    'email' => $supplier['email'],
                    'address' => $supplier['address'],
                    'materials_supplied' => $supplier['materials_supplied'],
                    'balance' => 0,
                    'notes' => $supplier['notes'],
                    'is_active' => true,
                    'metadata' => ['seeded' => true],
                ],
            );

            return [$supplier['name'] => $model];
        });

        /** @var PurchaseService $purchaseService */
        $purchaseService = app(PurchaseService::class);
        /** @var SaleService $saleService */
        $saleService = app(SaleService::class);
        /** @var PaymentService $paymentService */
        $paymentService = app(PaymentService::class);
        /** @var CashTransactionService $cashTransactionService */
        $cashTransactionService = app(CashTransactionService::class);
        /** @var AuditLogService $auditLogService */
        $auditLogService = app(AuditLogService::class);

        $purchaseOne = Purchase::query()->firstOrNew(['description' => 'Early March yard intake']);
        if (! $purchaseOne->exists) {
            $purchaseOne = $purchaseService->create([
                'branch_id' => $branch->id,
                'supplier_id' => $suppliers['Musa Yard Suppliers']->id,
                'purchase_date' => '2026-03-05',
                'status' => PurchaseStatus::Received->value,
                'other_charges' => 35000,
                'description' => 'Early March yard intake',
                'notes' => 'Mixed karfe and Jar Waya intake from Dakata route.',
                'tag_ids' => [$tags['yard-intake']->id, $tags['transport']->id],
                'items' => [
                    [
                        'product_id' => $products['karfe']->id,
                        'description' => 'Heavy karfe bundles',
                        'quantity' => 1800,
                        'unit_cost' => 420,
                    ],
                    [
                        'product_id' => $products['jar-waya']->id,
                        'description' => 'Sorted Jar Waya',
                        'quantity' => 350,
                        'unit_cost' => 1550,
                    ],
                ],
                'payment' => [
                    'payment_date' => '2026-03-05',
                    'method' => PaymentMethod::Cash->value,
                    'amount' => 450000,
                    'reference_number' => 'PUR-INTAKE-001',
                    'notes' => 'Initial cash payment to supplier.',
                ],
            ], $storekeeper);
        }

        $purchaseTwo = Purchase::query()->firstOrNew(['description' => 'Mid-month premium metals intake']);
        if (! $purchaseTwo->exists) {
            $purchaseTwo = $purchaseService->create([
                'branch_id' => $branch->id,
                'supplier_id' => $suppliers['Zaria Cable Recovery']->id,
                'purchase_date' => '2026-03-12',
                'status' => PurchaseStatus::Received->value,
                'other_charges' => 50000,
                'description' => 'Mid-month premium metals intake',
                'notes' => 'Higher-value non-ferrous supply from Zaria.',
                'tag_ids' => [$tags['yard-intake']->id, $tags['bank-transfer']->id],
                'items' => [
                    [
                        'product_id' => $products['aluminium']->id,
                        'description' => 'Mixed aluminium profile',
                        'quantity' => 500,
                        'unit_cost' => 1650,
                    ],
                    [
                        'product_id' => $products['copper']->id,
                        'description' => 'Clean copper cable recovery',
                        'quantity' => 220,
                        'unit_cost' => 5100,
                    ],
                ],
                'payment' => [
                    'payment_date' => '2026-03-12',
                    'method' => PaymentMethod::BankTransfer->value,
                    'amount' => 1000000,
                    'reference_number' => 'TRF-ZCR-0312',
                    'notes' => 'Initial transfer to supplier.',
                ],
            ], $storekeeper);
        }

        $purchaseThree = Purchase::query()->firstOrNew(['description' => 'Late month mixed intake']);
        if (! $purchaseThree->exists) {
            $purchaseThree = $purchaseService->create([
                'branch_id' => $branch->id,
                'supplier_id' => $suppliers['Arewa Metal Aggregators']->id,
                'purchase_date' => '2026-03-24',
                'status' => PurchaseStatus::Received->value,
                'other_charges' => 25000,
                'description' => 'Late month mixed intake',
                'notes' => 'Mixed load including brass and battery scrap.',
                'tag_ids' => [$tags['yard-intake']->id, $tags['urgent']->id],
                'items' => [
                    [
                        'product_id' => $products['brass']->id,
                        'description' => 'Sorted brass valves',
                        'quantity' => 190,
                        'unit_cost' => 3200,
                    ],
                    [
                        'product_id' => $products['mixed-metals']->id,
                        'description' => 'Mixed recovery sacks',
                        'quantity' => 700,
                        'unit_cost' => 1200,
                    ],
                    [
                        'product_id' => $products['battery-scrap']->id,
                        'description' => 'Used battery units',
                        'quantity' => 150,
                        'unit_cost' => 2600,
                    ],
                ],
                'payment' => [
                    'payment_date' => '2026-03-24',
                    'method' => PaymentMethod::BankTransfer->value,
                    'amount' => 600000,
                    'reference_number' => 'TRF-AMA-0324',
                    'notes' => 'Initial transfer for mixed intake.',
                ],
            ], $storekeeper);
        }

        if (! $purchaseThree->payments()->where('reference_number', 'TRF-AMA-0330')->exists()) {
            $paymentService->record([
                'branch_id' => $branch->id,
                'purchase_id' => $purchaseThree->id,
                'supplier_id' => $purchaseThree->supplier_id,
                'payment_date' => '2026-03-30',
                'method' => PaymentMethod::BankTransfer->value,
                'amount' => 250000,
                'reference_number' => 'TRF-AMA-0330',
                'notes' => 'Additional settlement on late month intake.',
                'category_name' => 'Supplier Payment',
            ], $cashier);
        }

        $saleOne = Sale::query()->firstOrNew(['description' => 'Weekly ferrous and wire dispatch']);
        if (! $saleOne->exists) {
            $saleOne = $saleService->create([
                'branch_id' => $branch->id,
                'customer_id' => $customers['Aisha Metal Works']->id,
                'sale_date' => '2026-03-08',
                'due_date' => '2026-03-10',
                'status' => SaleStatus::Completed->value,
                'transport_fee' => 15000,
                'other_charges' => 5000,
                'description' => 'Weekly ferrous and wire dispatch',
                'notes' => 'Loaded from Kano yard to Sharada.',
                'tag_ids' => [$tags['wholesale']->id, $tags['transport']->id],
                'items' => [
                    [
                        'product_id' => $products['karfe']->id,
                        'description' => 'Karfe truck load',
                        'quantity' => 600,
                        'unit_price' => 650,
                        'discount_amount' => 0,
                    ],
                    [
                        'product_id' => $products['jar-waya']->id,
                        'description' => 'Jar Waya bundles',
                        'quantity' => 120,
                        'unit_price' => 2300,
                        'discount_amount' => 10000,
                    ],
                ],
                'payment' => [
                    'payment_date' => '2026-03-08',
                    'method' => PaymentMethod::BankTransfer->value,
                    'amount' => 300000,
                    'reference_number' => 'CUS-AISHA-0308',
                    'notes' => 'Initial transfer on dispatch day.',
                ],
            ], $salesStaff);
        }

        $saleTwo = Sale::query()->firstOrNew(['description' => 'Foundry-grade non-ferrous sale']);
        if (! $saleTwo->exists) {
            $saleTwo = $saleService->create([
                'branch_id' => $branch->id,
                'customer_id' => $customers['Kano Foundry Works']->id,
                'sale_date' => '2026-03-15',
                'due_date' => '2026-03-15',
                'status' => SaleStatus::Completed->value,
                'transport_fee' => 20000,
                'other_charges' => 0,
                'description' => 'Foundry-grade non-ferrous sale',
                'notes' => 'Same-day delivery to foundry.',
                'tag_ids' => [$tags['wholesale']->id, $tags['bank-transfer']->id],
                'items' => [
                    [
                        'product_id' => $products['aluminium']->id,
                        'description' => 'Aluminium profile mix',
                        'quantity' => 200,
                        'unit_price' => 2500,
                        'discount_amount' => 0,
                    ],
                    [
                        'product_id' => $products['copper']->id,
                        'description' => 'Premium copper',
                        'quantity' => 70,
                        'unit_price' => 6500,
                        'discount_amount' => 0,
                    ],
                ],
                'payment' => [
                    'payment_date' => '2026-03-15',
                    'method' => PaymentMethod::BankTransfer->value,
                    'amount' => 975000,
                    'reference_number' => 'KFW-0315',
                    'notes' => 'Full settlement on dispatch.',
                ],
            ], $salesStaff);
        }

        $saleThree = Sale::query()->firstOrNew(['description' => 'Pending mixed metals quotation']);
        if (! $saleThree->exists) {
            $saleThree = $saleService->create([
                'branch_id' => $branch->id,
                'customer_id' => $customers['Northern Recyclers Ltd']->id,
                'sale_date' => '2026-03-26',
                'due_date' => '2026-03-31',
                'status' => SaleStatus::Draft->value,
                'transport_fee' => 0,
                'other_charges' => 0,
                'description' => 'Pending mixed metals quotation',
                'notes' => 'Awaiting customer confirmation before release.',
                'tag_ids' => [$tags['urgent']->id],
                'items' => [
                    [
                        'product_id' => $products['brass']->id,
                        'description' => 'Brass lot under review',
                        'quantity' => 45,
                        'unit_price' => 4100,
                        'discount_amount' => 0,
                    ],
                    [
                        'product_id' => $products['mixed-metals']->id,
                        'description' => 'Mixed metals lot',
                        'quantity' => 100,
                        'unit_price' => 1700,
                        'discount_amount' => 0,
                    ],
                ],
            ], $salesStaff);
        }

        $saleFour = Sale::query()->firstOrNew(['description' => 'Weekend walk-in clearance']);
        if (! $saleFour->exists) {
            $saleFour = $saleService->create([
                'branch_id' => $branch->id,
                'customer_id' => $customers['Sabon Gari Traders']->id,
                'sale_date' => '2026-03-28',
                'due_date' => '2026-03-29',
                'status' => SaleStatus::Completed->value,
                'transport_fee' => 0,
                'other_charges' => 8000,
                'description' => 'Weekend walk-in clearance',
                'notes' => 'Walk-in customer took small mixed load.',
                'tag_ids' => [$tags['repeat-customer']->id],
                'items' => [
                    [
                        'product_id' => $products['battery-scrap']->id,
                        'description' => 'Battery scrap units',
                        'quantity' => 50,
                        'unit_price' => 4200,
                        'discount_amount' => 0,
                    ],
                    [
                        'product_id' => $products['karfe']->id,
                        'description' => 'Karfe short load',
                        'quantity' => 180,
                        'unit_price' => 700,
                        'discount_amount' => 0,
                    ],
                ],
                'payment' => [
                    'payment_date' => '2026-03-28',
                    'method' => PaymentMethod::Cash->value,
                    'amount' => 100000,
                    'reference_number' => 'SGT-0328',
                    'notes' => 'Initial cash collected at yard.',
                ],
            ], $salesStaff);
        }

        $saleFive = Sale::query()->firstOrNew(['description' => 'Month-end brass and aluminium dispatch']);
        if (! $saleFive->exists) {
            $saleFive = $saleService->create([
                'branch_id' => $branch->id,
                'customer_id' => $customers['Northern Recyclers Ltd']->id,
                'sale_date' => '2026-03-30',
                'due_date' => '2026-04-02',
                'status' => SaleStatus::Completed->value,
                'transport_fee' => 5000,
                'other_charges' => 0,
                'description' => 'Month-end brass and aluminium dispatch',
                'notes' => 'Late month load to close weekly target.',
                'tag_ids' => [$tags['bank-transfer']->id, $tags['wholesale']->id],
                'items' => [
                    [
                        'product_id' => $products['brass']->id,
                        'description' => 'Brass closing lot',
                        'quantity' => 20,
                        'unit_price' => 4300,
                        'discount_amount' => 0,
                    ],
                    [
                        'product_id' => $products['aluminium']->id,
                        'description' => 'Aluminium closing lot',
                        'quantity' => 35,
                        'unit_price' => 2550,
                        'discount_amount' => 0,
                    ],
                ],
                'payment' => [
                    'payment_date' => '2026-03-30',
                    'method' => PaymentMethod::BankTransfer->value,
                    'amount' => 80000,
                    'reference_number' => 'NRL-0330',
                    'notes' => 'Deposit before balance settlement.',
                ],
            ], $salesStaff);
        }

        if (! $saleOne->invoice->payments()->where('reference_number', 'CUS-AISHA-0329')->exists()) {
            $paymentService->record([
                'branch_id' => $branch->id,
                'invoice_id' => $saleOne->invoice->id,
                'customer_id' => $saleOne->customer_id,
                'payment_date' => '2026-03-29',
                'method' => PaymentMethod::BankTransfer->value,
                'amount' => 150000,
                'reference_number' => 'CUS-AISHA-0329',
                'notes' => 'Second part payment from Aisha Metal Works.',
            ], $cashier);
        }

        $expenseCategories = ExpenseCategory::query()->get()->keyBy('slug');

        $manualInflow = $cashTransactionService->record([
            'branch_id' => $branch->id,
            'expense_category_id' => $expenseCategories['other-income']->id ?? null,
            'transaction_date' => '2026-03-30',
            'direction' => CashTransactionDirection::Inflow->value,
            'category_name' => 'Other Income',
            'payment_method' => PaymentMethod::Cash->value,
            'amount' => 35000,
            'reference_number' => 'OTH-0330',
            'description' => 'Sale of used sacks and small offcuts.',
            'tag_ids' => [$tags['repeat-customer']->id],
        ], $cashier);

        $fuelExpense = $cashTransactionService->record([
            'branch_id' => $branch->id,
            'expense_category_id' => $expenseCategories['fuel']->id ?? null,
            'transaction_date' => '2026-03-29',
            'direction' => CashTransactionDirection::Outflow->value,
            'category_name' => 'Fuel',
            'payment_method' => PaymentMethod::Cash->value,
            'amount' => 18000,
            'reference_number' => 'FUEL-0329',
            'description' => 'Fuel purchase for delivery truck and generator.',
            'tag_ids' => [$tags['transport']->id],
        ], $cashier);

        $salaryExpense = $cashTransactionService->record([
            'branch_id' => $branch->id,
            'expense_category_id' => $expenseCategories['salary-allowance']->id ?? null,
            'transaction_date' => '2026-03-25',
            'direction' => CashTransactionDirection::Outflow->value,
            'category_name' => 'Salary / Allowance',
            'payment_method' => PaymentMethod::BankTransfer->value,
            'amount' => 85000,
            'reference_number' => 'SAL-0325',
            'description' => 'Weekly support allowance and overtime payment.',
        ], $cashier);

        $maintenanceExpense = $cashTransactionService->record([
            'branch_id' => $branch->id,
            'expense_category_id' => $expenseCategories['maintenance']->id ?? null,
            'transaction_date' => '2026-03-18',
            'direction' => CashTransactionDirection::Outflow->value,
            'category_name' => 'Maintenance',
            'payment_method' => PaymentMethod::Cash->value,
            'amount' => 42000,
            'reference_number' => 'MNT-0318',
            'description' => 'Weighbridge calibration and minor welding repairs.',
        ], $cashier);

        Storage::disk('public')->put(
            'documents/purchase-receipt-20260305.txt',
            "Supplier receipt for {$purchaseOne->purchase_number}\nAmount due: {$purchaseOne->balance_due}\n",
        );

        Storage::disk('public')->put(
            'documents/payment-proof-20260330.txt',
            "Payment proof for {$manualInflow->transaction_number}\nAmount: {$manualInflow->amount}\n",
        );

        Storage::disk('public')->put(
            'documents/internal-memo-20260330.txt',
            "Month-end memo\nSort brass first thing tomorrow.\n",
        );

        $invoicePath = $saleOne->invoice->fresh()->pdf_path;
        $invoiceFileName = $invoicePath ? basename($invoicePath) : 'invoice-copy.pdf';
        $invoiceMimeType = $invoicePath ? 'application/pdf' : 'text/plain';
        $invoiceFileSize = $invoicePath && Storage::disk('public')->exists($invoicePath)
            ? Storage::disk('public')->size($invoicePath)
            : 0;

        if ($invoicePath && ! Document::query()->where('title', "Invoice copy - {$saleOne->invoice->invoice_number}")->exists()) {
            $document = Document::query()->create([
                'branch_id' => $branch->id,
                'uploaded_by' => $cashier->id,
                'customer_id' => $saleOne->customer_id,
                'sale_id' => $saleOne->id,
                'invoice_id' => $saleOne->invoice->id,
                'title' => "Invoice copy - {$saleOne->invoice->invoice_number}",
                'document_type' => DocumentType::Invoice->value,
                'reference_number' => $saleOne->invoice->invoice_number,
                'file_name' => $invoiceFileName,
                'file_path' => $invoicePath,
                'disk' => 'public',
                'mime_type' => $invoiceMimeType,
                'file_size' => $invoiceFileSize,
                'document_date' => $saleOne->sale_date,
                'description' => 'Auto-generated invoice PDF saved to the document registry.',
                'metadata' => ['seeded' => true],
            ]);
            $document->syncTagsByIds([$tags['bank-transfer']->id, $tags['wholesale']->id]);
            $auditLogService->log(
                event: 'document.created',
                description: "Document {$document->title} uploaded",
                auditable: $document,
                newValues: $document->toArray(),
                user: $cashier,
                branchId: $branch->id,
            );
        }

        if (! Document::query()->where('title', "Supplier receipt - {$purchaseOne->purchase_number}")->exists()) {
            $document = Document::query()->create([
                'branch_id' => $branch->id,
                'uploaded_by' => $storekeeper->id,
                'supplier_id' => $purchaseOne->supplier_id,
                'purchase_id' => $purchaseOne->id,
                'title' => "Supplier receipt - {$purchaseOne->purchase_number}",
                'document_type' => DocumentType::Receipt->value,
                'reference_number' => $purchaseOne->purchase_number,
                'file_name' => 'purchase-receipt-20260305.txt',
                'file_path' => 'documents/purchase-receipt-20260305.txt',
                'disk' => 'public',
                'mime_type' => 'text/plain',
                'file_size' => Storage::disk('public')->size('documents/purchase-receipt-20260305.txt'),
                'document_date' => $purchaseOne->purchase_date,
                'description' => 'Supplier receipt captured for March intake.',
                'metadata' => ['seeded' => true],
            ]);
            $document->syncTagsByIds([$tags['yard-intake']->id]);
            $auditLogService->log(
                event: 'document.created',
                description: "Document {$document->title} uploaded",
                auditable: $document,
                newValues: $document->toArray(),
                user: $storekeeper,
                branchId: $branch->id,
            );
        }

        if (! Document::query()->where('title', "Payment proof - {$manualInflow->transaction_number}")->exists()) {
            $document = Document::query()->create([
                'branch_id' => $branch->id,
                'uploaded_by' => $cashier->id,
                'cash_transaction_id' => $manualInflow->id,
                'title' => "Payment proof - {$manualInflow->transaction_number}",
                'document_type' => DocumentType::PaymentProof->value,
                'reference_number' => $manualInflow->reference_number,
                'file_name' => 'payment-proof-20260330.txt',
                'file_path' => 'documents/payment-proof-20260330.txt',
                'disk' => 'public',
                'mime_type' => 'text/plain',
                'file_size' => Storage::disk('public')->size('documents/payment-proof-20260330.txt'),
                'document_date' => $manualInflow->transaction_date,
                'description' => 'Supporting proof for miscellaneous business income.',
                'metadata' => ['seeded' => true],
            ]);
            $document->syncTagsByIds([$tags['repeat-customer']->id]);
            $auditLogService->log(
                event: 'document.created',
                description: "Document {$document->title} uploaded",
                auditable: $document,
                newValues: $document->toArray(),
                user: $cashier,
                branchId: $branch->id,
            );
        }

        if (! Document::query()->where('title', 'Internal memo - month end stock plan')->exists()) {
            $document = Document::query()->create([
                'branch_id' => $branch->id,
                'uploaded_by' => $owner->id,
                'title' => 'Internal memo - month end stock plan',
                'document_type' => DocumentType::InternalMemo->value,
                'reference_number' => 'MEMO-0330',
                'file_name' => 'internal-memo-20260330.txt',
                'file_path' => 'documents/internal-memo-20260330.txt',
                'disk' => 'public',
                'mime_type' => 'text/plain',
                'file_size' => Storage::disk('public')->size('documents/internal-memo-20260330.txt'),
                'document_date' => '2026-03-30',
                'description' => 'Owner memo for next-day sorting priorities.',
                'metadata' => [
                    'seeded' => true,
                    'related_cash_transactions' => [$fuelExpense->id, $salaryExpense->id, $maintenanceExpense->id],
                ],
            ]);
            $document->syncTagsByIds([$tags['urgent']->id]);
            $auditLogService->log(
                event: 'document.created',
                description: "Document {$document->title} uploaded",
                auditable: $document,
                newValues: $document->toArray(),
                user: $owner,
                branchId: $branch->id,
            );
        }
    }
}
