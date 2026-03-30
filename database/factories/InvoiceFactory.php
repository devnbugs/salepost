<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalAmount = fake()->randomFloat(2, 40000, 800000);
        $amountPaid = fake()->randomFloat(2, 0, $totalAmount / 2);

        return [
            'branch_id' => Branch::factory(),
            'sale_id' => Sale::factory(),
            'customer_id' => Customer::factory(),
            'issued_by' => User::factory(),
            'invoice_number' => strtoupper(fake()->unique()->bothify('INV-########')),
            'invoice_date' => fake()->dateTimeBetween('-30 days')->format('Y-m-d'),
            'due_date' => fake()->dateTimeBetween('now', '+14 days')->format('Y-m-d'),
            'status' => fake()->randomElement(InvoiceStatus::values()),
            'currency' => 'NGN',
            'subtotal' => $totalAmount,
            'charges_total' => 0,
            'total_amount' => $totalAmount,
            'amount_paid' => $amountPaid,
            'balance_due' => max($totalAmount - $amountPaid, 0),
            'pdf_path' => null,
            'notes' => fake()->optional()->sentence(),
            'metadata' => [
                'seeded' => true,
            ],
        ];
    }
}
