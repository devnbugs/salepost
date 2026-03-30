<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PurchaseItem>
 */
class PurchaseItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->randomFloat(3, 5, 120);
        $unitCost = fake()->randomFloat(2, 200, 7000);

        return [
            'purchase_id' => Purchase::factory(),
            'product_id' => Product::factory(),
            'description' => fake()->sentence(3),
            'quantity' => $quantity,
            'unit_cost' => $unitCost,
            'total_cost' => round($quantity * $unitCost, 2),
            'sort_order' => fake()->numberBetween(0, 3),
        ];
    }
}
