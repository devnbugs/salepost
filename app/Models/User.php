<?php

namespace App\Models;

use App\Enums\ThemePreference;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $fillable = [
        'branch_id',
        'role_id',
        'name',
        'email',
        'phone',
        'job_title',
        'avatar_path',
        'google_id',
        'avatar',
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

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
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
        return ($this->role && $this->role->slug === 'super-admin') || strcasecmp($this->job_title ?? '', 'owner') === 0;
    }

    /**
     * Determine if the user has a specific permission.
     */
    public function hasPermission(string $permissionSlug): bool
    {
        if ($this->isOwner()) {
            return true;
        }

        if (! $this->is_active) {
            return false;
        }

        return (bool) ($this->role && $this->role->permissions()->where('slug', $permissionSlug)->exists());
    }
}
