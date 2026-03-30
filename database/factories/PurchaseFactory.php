<?php

namespace Database\Factories;

use App\Enums\PurchaseStatus;
use App\Enums\SettlementStatus;
use App\Models\Branch;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Purchase>
 */
class PurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalAmount = fake()->randomFloat(2, 50000, 700000);
        $amountPaid = fake()->randomFloat(2, 0, $totalAmount / 2);

        return [
            'branch_id' => Branch::factory(),
            'supplier_id' => Supplier::factory(),
            'created_by' => User::factory(),
            'purchase_number' => strtoupper(fake()->unique()->bothify('PUR-########')),
            'purchase_date' => fake()->dateTimeBetween('-30 days')->format('Y-m-d'),
            'status' => fake()->randomElement(PurchaseStatus::values()),
            'payment_status' => fake()->randomElement(SettlementStatus::values()),
            'currency' => 'NGN',
            'subtotal' => $totalAmount,
            'other_charges' => fake()->randomFloat(2, 0, 25000),
            'total_amount' => $totalAmount,
            'amount_paid' => $amountPaid,
            'balance_due' => max($totalAmount - $amountPaid, 0),
            'attachment_path' => null,
            'description' => fake()->sentence(),
            'notes' => fake()->optional()->sentence(),
            'metadata' => [
                'seeded' => true,
            ],
        ];
    }
}
