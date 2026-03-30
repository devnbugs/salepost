<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('sale_number')->unique();
            $table->date('sale_date')->index();
            $table->string('status')->default('draft')->index();
            $table->string('payment_status')->default('unpaid')->index();
            $table->string('currency', 3)->default('NGN');
            $table->unsignedInteger('item_count')->default(0);
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->decimal('discount_total', 18, 2)->default(0);
            $table->decimal('transport_fee', 18, 2)->default(0);
            $table->decimal('other_charges', 18, 2)->default(0);
            $table->decimal('total_amount', 18, 2)->default(0);
            $table->decimal('amount_paid', 18, 2)->default(0);
            $table->decimal('balance_due', 18, 2)->default(0);
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
