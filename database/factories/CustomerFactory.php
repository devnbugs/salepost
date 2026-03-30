<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
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
            'name' => fake()->name(),
            'phone' => '+234'.fake()->numerify('80########'),
            'email' => fake()->unique()->safeEmail(),
            'company_name' => fake()->optional()->company(),
            'address' => fake()->address(),
            'balance' => 0,
            'notes' => fake()->optional()->sentence(),
            'is_active' => true,
            'metadata' => [
                'source' => fake()->randomElement(['walk_in', 'referral', 'market_contact']),
            ],
        ];
    }
}
