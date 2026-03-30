<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'branch_id' => fake()->boolean(80) ? Branch::factory() : null,
            'user_id' => fake()->boolean(80) ? User::factory() : null,
            'event' => fake()->randomElement([
                'sale.created',
                'purchase.created',
                'payment.recorded',
                'stock.adjusted',
                'document.created',
            ]),
            'description' => fake()->sentence(),
            'auditable_type' => null,
            'auditable_id' => null,
            'old_values' => null,
            'new_values' => ['seeded' => true],
            'metadata' => ['source' => 'factory'],
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'url' => fake()->url(),
            'method' => fake()->randomElement(['POST', 'PATCH', 'DELETE']),
        ];
    }
}
