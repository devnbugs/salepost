<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('description')->nullable();
            $table->decimal('quantity', 18, 3);
            $table->decimal('unit_cost', 18, 2)->default(0);
            $table->decimal('unit_price', 18, 2);
            $table->decimal('discount_amount', 18, 2)->default(0);
            $table->decimal('subtotal', 18, 2);
            $table->decimal('total_amount', 18, 2);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
