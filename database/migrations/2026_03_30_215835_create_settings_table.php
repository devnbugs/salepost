<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->string('group')->index();
            $table->string('key');
            $table->string('label')->nullable();
            $table->string('type')->default('string');
            $table->longText('value')->nullable();
            $table->boolean('is_public')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['branch_id', 'group', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
