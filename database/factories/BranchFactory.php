<?php

namespace Database\Factories;

use App\Models\Branch;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Branch>
 */
class BranchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Kano Main Yard',
                'Kaduna Collection Point',
                'Abuja Sorting Hub',
                'Jos Recovery Yard',
            ]),
            'code' => strtoupper(fake()->unique()->lexify(Str::upper(Str::random(3)))),
            'phone' => '+234'.fake()->numerify('80########'),
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'is_default' => false,
            'is_active' => true,
            'metadata' => [
                'region' => fake()->randomElement(['North West', 'North Central']),
            ],
        ];
    }
}
