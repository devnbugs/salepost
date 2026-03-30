<?php

namespace App\Enums\Concerns;

trait HasOptions
{
    public static function values(): array
    {
        return array_map(static fn (self $case) => $case->value, self::cases());
    }

    public static function options(): array
    {
        return array_map(
            static fn (self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
            ],
            self::cases(),
        );
    }

    public function label(): string
    {
        return str($this->value)->replace('_', ' ')->title()->toString();
    }
}
