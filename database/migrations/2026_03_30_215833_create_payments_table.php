<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sale_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('purchase_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('cash_transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete();
            $table->string('payment_number')->unique();
            $table->date('payment_date')->index();
            $table->string('direction')->default('inflow')->index();
            $table->string('status')->default('confirmed')->index();
            $table->string('method')->nullable()->index();
            $table->decimal('amount', 18, 2);
            $table->string('reference_number')->nullable()->index();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
