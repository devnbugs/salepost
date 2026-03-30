<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    /** @use HasFactory<\Database\Factories\SettingFactory> */
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'group',
        'key',
        'label',
        'type',
        'value',
        'is_public',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function scopeGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }
}
