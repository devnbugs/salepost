<?php

namespace Database\Factories;

use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ExpenseCategory>
 */
class ExpenseCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Transport',
            'Fuel',
            'Maintenance',
            'Salary',
            'Supplier Payment',
            'Miscellaneous Income',
            'Operational Expenses',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(10, 99),
            'type' => fake()->randomElement(['cash_in', 'cash_out']),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
