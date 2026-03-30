<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->string('phone')->nullable()->after('email');
            $table->string('job_title')->nullable()->after('phone');
            $table->string('avatar_path')->nullable()->after('job_title');
            $table->string('theme_preference')->default('system')->after('avatar_path');
            $table->boolean('is_active')->default(true)->after('theme_preference');
            $table->boolean('two_factor_enabled')->default(false)->after('is_active');
            $table->timestamp('last_login_at')->nullable()->after('remember_token');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('branch_id');
            $table->dropColumn([
                'phone',
                'job_title',
                'avatar_path',
                'theme_preference',
                'is_active',
                'two_factor_enabled',
                'last_login_at',
                'last_login_ip',
            ]);
        });
    }
};
