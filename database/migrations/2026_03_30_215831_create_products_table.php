<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('sku')->nullable();
            $table->text('description')->nullable();
            $table->string('unit_of_measure')->default('kg');
            $table->decimal('cost_price', 18, 2)->default(0);
            $table->decimal('selling_price', 18, 2)->default(0);
            $table->decimal('current_stock', 18, 3)->default(0);
            $table->decimal('reorder_level', 18, 3)->default(0);
            $table->string('status')->default('active')->index();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['branch_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
