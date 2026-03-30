<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SaleItem>
 */
class SaleItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->randomFloat(3, 1, 80);
        $unitPrice = fake()->randomFloat(2, 350, 8500);
        $discount = fake()->randomFloat(2, 0, 5000);
        $subtotal = round($quantity * $unitPrice, 2);

        return [
            'sale_id' => Sale::factory(),
            'product_id' => Product::factory(),
            'description' => fake()->sentence(3),
            'quantity' => $quantity,
            'unit_cost' => fake()->randomFloat(2, 200, 6000),
            'unit_price' => $unitPrice,
            'discount_amount' => $discount,
            'subtotal' => $subtotal,
            'total_amount' => max($subtotal - $discount, 0),
            'sort_order' => fake()->numberBetween(0, 3),
        ];
    }
}
