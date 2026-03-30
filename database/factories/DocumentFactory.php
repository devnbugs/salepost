<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Models\Branch;
use App\Models\User;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
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
            'uploaded_by' => User::factory(),
            'customer_id' => null,
            'supplier_id' => null,
            'sale_id' => null,
            'purchase_id' => null,
            'invoice_id' => null,
            'cash_transaction_id' => null,
            'title' => fake()->sentence(3),
            'document_type' => fake()->randomElement(DocumentType::values()),
            'reference_number' => strtoupper(fake()->bothify('DOC-####')),
            'file_name' => fake()->lexify('document-????').'.txt',
            'file_path' => 'documents/'.fake()->uuid().'.txt',
            'disk' => 'public',
            'mime_type' => 'text/plain',
            'file_size' => fake()->numberBetween(1200, 9800),
            'document_date' => fake()->dateTimeBetween('-60 days')->format('Y-m-d'),
            'expiry_date' => fake()->optional()->dateTimeBetween('+10 days', '+1 year')->format('Y-m-d'),
            'description' => fake()->sentence(),
            'metadata' => [
                'seeded' => true,
            ],
        ];
    }
}
