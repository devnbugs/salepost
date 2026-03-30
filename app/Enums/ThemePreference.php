<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum ThemePreference: string
{
    use HasOptions;

    case Light = 'light';
    case Dark = 'dark';
    case System = 'system';
}
