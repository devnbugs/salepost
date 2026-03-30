<?php

namespace Database\Factories;

use App\Enums\CashTransactionDirection;
use App\Enums\PaymentMethod;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'branch_id' => Branch::factory(),
            'invoice_id' => null,
            'sale_id' => null,
            'purchase_id' => null,
            'customer_id' => Customer::factory(),
            'supplier_id' => null,
            'cash_transaction_id' => null,
            'recorded_by' => User::factory(),
            'payment_number' => strtoupper(fake()->unique()->bothify('PAY-########')),
            'payment_date' => fake()->dateTimeBetween('-30 days')->format('Y-m-d'),
            'direction' => CashTransactionDirection::Inflow->value,
            'status' => 'confirmed',
            'method' => fake()->randomElement(PaymentMethod::values()),
            'amount' => fake()->randomFloat(2, 5000, 250000),
            'reference_number' => strtoupper(fake()->bothify('PMT-####??')),
            'notes' => fake()->sentence(),
            'metadata' => [
                'seeded' => true,
            ],
        ];
    }
}
