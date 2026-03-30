<?php

namespace Database\Factories;

use App\Enums\SaleStatus;
use App\Enums\SettlementStatus;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 40000, 650000);
        $transportFee = fake()->randomFloat(2, 0, 15000);
        $otherCharges = fake()->randomFloat(2, 0, 10000);
        $totalAmount = $subtotal + $transportFee + $otherCharges;
        $amountPaid = fake()->randomFloat(2, 0, $totalAmount / 2);

        return [
            'branch_id' => Branch::factory(),
            'customer_id' => Customer::factory(),
            'created_by' => User::factory(),
            'sale_number' => strtoupper(fake()->unique()->bothify('SAL-########')),
            'sale_date' => fake()->dateTimeBetween('-30 days')->format('Y-m-d'),
            'status' => fake()->randomElement(SaleStatus::values()),
            'payment_status' => fake()->randomElement(SettlementStatus::values()),
            'currency' => 'NGN',
            'item_count' => fake()->numberBetween(1, 4),
            'subtotal' => $subtotal,
            'discount_total' => 0,
            'transport_fee' => $transportFee,
            'other_charges' => $otherCharges,
            'total_amount' => $totalAmount,
            'amount_paid' => $amountPaid,
            'balance_due' => max($totalAmount - $amountPaid, 0),
            'description' => fake()->sentence(),
            'notes' => fake()->optional()->sentence(),
            'metadata' => [
                'seeded' => true,
            ],
        ];
    }
}
