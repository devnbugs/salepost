<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductCategory>
 */
class ProductCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Ferrous Metals',
            'Non-Ferrous Metals',
            'Wire Scrap',
            'Battery Scrap',
            'Mixed Materials',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(10, 99),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
