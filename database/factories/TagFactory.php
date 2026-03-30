<?php

namespace Database\Factories;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Wholesale',
            'Urgent',
            'Transport',
            'Bank Transfer',
            'Repeat Customer',
            'Yard Intake',
            'Operations',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(10, 99),
            'color' => fake()->randomElement([
                '#0f766e',
                '#1d4ed8',
                '#b45309',
                '#be123c',
                '#475569',
            ]),
            'description' => fake()->sentence(),
            'created_by' => fake()->boolean(50) ? User::factory() : null,
        ];
    }
}
