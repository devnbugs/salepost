<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sale_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('issued_by')->constrained('users')->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->date('invoice_date')->index();
            $table->date('due_date')->nullable()->index();
            $table->string('status')->default('issued')->index();
            $table->string('currency', 3)->default('NGN');
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->decimal('charges_total', 18, 2)->default(0);
            $table->decimal('total_amount', 18, 2)->default(0);
            $table->decimal('amount_paid', 18, 2)->default(0);
            $table->decimal('balance_due', 18, 2)->default(0);
            $table->string('pdf_path')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
