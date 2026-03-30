<?php

namespace Database\Factories;

use App\Enums\StockMovementType;
use App\Models\Branch;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantityBefore = fake()->randomFloat(3, 20, 200);
        $quantityDelta = fake()->randomFloat(3, -50, 80);

        return [
            'branch_id' => Branch::factory(),
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'type' => fake()->randomElement(StockMovementType::values()),
            'quantity' => $quantityDelta,
            'quantity_before' => $quantityBefore,
            'quantity_after' => round($quantityBefore + $quantityDelta, 3),
            'reference_number' => strtoupper(fake()->bothify('STK-####??')),
            'movement_date' => fake()->dateTimeBetween('-30 days'),
            'notes' => fake()->sentence(),
            'metadata' => [
                'seeded' => true,
            ],
            'source_type' => null,
            'source_id' => null,
        ];
    }
}
