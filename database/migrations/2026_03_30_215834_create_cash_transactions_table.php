<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('expense_category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sale_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('purchase_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('recorded_by')->constrained('users')->cascadeOnDelete();
            $table->string('transaction_number')->unique();
            $table->date('transaction_date')->index();
            $table->string('direction')->index();
            $table->string('category_name')->nullable()->index();
            $table->string('payment_method')->nullable()->index();
            $table->decimal('amount', 18, 2);
            $table->string('reference_number')->nullable()->index();
            $table->string('attachment_path')->nullable();
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
    }
};
