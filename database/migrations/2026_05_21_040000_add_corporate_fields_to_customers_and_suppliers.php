<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (! Schema::hasColumn('customers', 'is_corporate')) {
                $table->boolean('is_corporate')->default(false)->after('name');
            }
            if (! Schema::hasColumn('customers', 'company_name')) {
                $table->string('company_name')->nullable()->after('is_corporate');
            }
            if (! Schema::hasColumn('customers', 'tin')) {
                $table->string('tin')->nullable()->after('company_name');
            }
            if (! Schema::hasColumn('customers', 'state')) {
                $table->string('state')->nullable()->after('address');
            }
        });

        Schema::table('suppliers', function (Blueprint $table) {
            if (! Schema::hasColumn('suppliers', 'is_corporate')) {
                $table->boolean('is_corporate')->default(false)->after('name');
            }
            if (! Schema::hasColumn('suppliers', 'company_name')) {
                $table->string('company_name')->nullable()->after('is_corporate');
            }
            if (! Schema::hasColumn('suppliers', 'tin')) {
                $table->string('tin')->nullable()->after('company_name');
            }
            if (! Schema::hasColumn('suppliers', 'state')) {
                $table->string('state')->nullable()->after('address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $cols = array_filter(['is_corporate', 'company_name', 'tin', 'state'], fn ($col) => Schema::hasColumn('customers', $col));
            if (! empty($cols)) {
                $table->dropColumn($cols);
            }
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $cols = array_filter(['is_corporate', 'company_name', 'tin', 'state'], fn ($col) => Schema::hasColumn('suppliers', $col));
            if (! empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
