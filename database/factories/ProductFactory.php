<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Branch;
use App\Models\ProductCategory;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Karfe',
            'Brass',
            'Jar Waya',
            'Aluminium',
            'Copper',
            'Battery Scrap',
            'Mixed Metals',
        ]);

        return [
            'branch_id' => Branch::factory(),
            'product_category_id' => ProductCategory::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'sku' => strtoupper(fake()->bothify('SCR-###??')),
            'description' => fake()->sentence(),
            'unit_of_measure' => fake()->randomElement(['kg', 'ton', 'bag', 'bundle', 'piece']),
            'cost_price' => fake()->randomFloat(2, 200, 7500),
            'selling_price' => fake()->randomFloat(2, 400, 9500),
            'current_stock' => fake()->randomFloat(3, 10, 450),
            'reorder_level' => fake()->randomFloat(3, 5, 60),
            'status' => ProductStatus::Active->value,
            'notes' => fake()->optional()->sentence(),
            'metadata' => [
                'grade' => fake()->randomElement(['A', 'B', 'Mixed']),
            ],
        ];
    }
}
