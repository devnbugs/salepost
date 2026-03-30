<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
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
            'name' => fake()->company(),
            'phone' => '+234'.fake()->numerify('80########'),
            'email' => fake()->unique()->companyEmail(),
            'address' => fake()->address(),
            'materials_supplied' => fake()->randomElements([
                'Karfe',
                'Brass',
                'Jar Waya',
                'Aluminium',
                'Copper',
                'Battery Scrap',
            ], fake()->numberBetween(1, 4)),
            'balance' => 0,
            'notes' => fake()->optional()->sentence(),
            'is_active' => true,
            'metadata' => [
                'source' => fake()->randomElement(['yard', 'aggregator', 'dealer']),
            ],
        ];
    }
}
