<?php

namespace Database\Factories;

use App\Enums\CashTransactionDirection;
use App\Enums\PaymentMethod;
use App\Models\CashTransaction;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\ExpenseCategory;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CashTransaction>
 */
class CashTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $direction = fake()->randomElement(CashTransactionDirection::values());

        return [
            'branch_id' => Branch::factory(),
            'expense_category_id' => ExpenseCategory::factory(),
            'customer_id' => $direction === CashTransactionDirection::Inflow->value ? Customer::factory() : null,
            'supplier_id' => $direction === CashTransactionDirection::Outflow->value ? Supplier::factory() : null,
            'sale_id' => null,
            'purchase_id' => null,
            'recorded_by' => User::factory(),
            'transaction_number' => strtoupper(fake()->unique()->bothify('CSH-########')),
            'transaction_date' => fake()->dateTimeBetween('-30 days')->format('Y-m-d'),
            'direction' => $direction,
            'category_name' => fake()->randomElement([
                'Sales Payment',
                'Transport',
                'Fuel',
                'Maintenance',
                'Miscellaneous Income',
            ]),
            'payment_method' => fake()->randomElement(PaymentMethod::values()),
            'amount' => fake()->randomFloat(2, 5000, 450000),
            'reference_number' => strtoupper(fake()->bothify('REF-####??')),
            'attachment_path' => null,
            'description' => fake()->sentence(),
            'metadata' => [
                'seeded' => true,
            ],
        ];
    }
}
