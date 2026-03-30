<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Collection;

class SettingsService
{
    public function all(string $group, ?int $branchId = null): array
    {
        $query = Setting::query()->where('group', $group);

        if ($branchId) {
            $settings = $query
                ->whereIn('branch_id', [$branchId, null])
                ->orderByRaw('branch_id is null desc')
                ->get();
        } else {
            $settings = $query->whereNull('branch_id')->get();
        }

        return $settings
            ->mapWithKeys(fn (Setting $setting) => [$setting->key => $this->parseValue($setting)])
            ->all();
    }

    public function get(string $group, string $key, mixed $default = null, ?int $branchId = null): mixed
    {
        return $this->all($group, $branchId)[$key] ?? $default;
    }

    public function setGroup(string $group, array $values, ?int $branchId = null): void
    {
        collect($values)
            ->reject(fn ($value) => is_null($value))
            ->each(function (mixed $value, string $key) use ($group, $branchId): void {
                Setting::query()->updateOrCreate(
                    [
                        'branch_id' => $branchId,
                        'group' => $group,
                        'key' => $key,
                    ],
                    [
                        'type' => $this->detectType($value),
                        'value' => $this->serializeValue($value),
                    ],
                );
            });
    }

    public function business(?int $branchId = null): array
    {
        return array_merge([
            'business_name' => 'Salepost Scrap Yard',
            'business_address' => 'Kano, Nigeria',
            'phone' => '+234 800 000 0000',
            'email' => 'owner@salepost.test',
            'currency' => 'NGN',
            'invoice_prefix' => 'INV',
            'allow_negative_stock' => false,
        ], $this->all('business', $branchId));
    }

    public function theme(?int $branchId = null): array
    {
        return array_merge([
            'default_theme' => 'system',
        ], $this->all('theme', $branchId));
    }

    public function parseCollection(Collection $settings): array
    {
        return $settings
            ->mapWithKeys(fn (Setting $setting) => [$setting->key => $this->parseValue($setting)])
            ->all();
    }

    private function parseValue(Setting $setting): mixed
    {
        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $setting->value,
            'float' => (float) $setting->value,
            'json' => json_decode($setting->value ?? '[]', true),
            default => $setting->value,
        };
    }

    private function detectType(mixed $value): string
    {
        return match (true) {
            is_bool($value) => 'boolean',
            is_int($value) => 'integer',
            is_float($value) => 'float',
            is_array($value) => 'json',
            default => 'string',
        };
    }

    private function serializeValue(mixed $value): ?string
    {
        return match (true) {
            is_array($value) => json_encode($value, JSON_THROW_ON_ERROR),
            is_bool($value) => $value ? '1' : '0',
            default => is_null($value) ? null : (string) $value,
        };
    }
}
