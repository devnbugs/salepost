<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum ProductStatus: string
{
    use HasOptions;

    case Active = 'active';
    case Inactive = 'inactive';
    case Archived = 'archived';
}
