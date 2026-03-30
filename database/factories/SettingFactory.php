<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Setting>
 */
class SettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'branch_id' => fake()->boolean(30) ? Branch::factory() : null,
            'group' => fake()->randomElement(['business', 'theme', 'documents']),
            'key' => fake()->unique()->slug(2, '_'),
            'label' => fake()->words(2, true),
            'type' => fake()->randomElement(['string', 'boolean', 'integer', 'float', 'json']),
            'value' => fake()->word(),
            'is_public' => fake()->boolean(),
            'metadata' => [
                'seeded' => true,
            ],
        ];
    }
}
