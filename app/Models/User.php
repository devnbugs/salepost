<?php

namespace App\Models;

use App\Enums\ThemePreference;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'branch_id',
        'name',
        'email',
        'phone',
        'job_title',
        'avatar_path',
        'theme_preference',
        'is_active',
        'two_factor_enabled',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'theme_preference' => ThemePreference::class,
            'is_active' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function salesCreated(): HasMany
    {
        return $this->hasMany(Sale::class, 'created_by');
    }

    public function purchasesCreated(): HasMany
    {
        return $this->hasMany(Purchase::class, 'created_by');
    }

    public function cashTransactionsRecorded(): HasMany
    {
        return $this->hasMany(CashTransaction::class, 'recorded_by');
    }

    public function documentsUploaded(): HasMany
    {
        return $this->hasMany(Document::class, 'uploaded_by');
    }

    public function isOwner(): bool
    {
        return $this->hasRole(UserRole::Owner->value);
    }
}
