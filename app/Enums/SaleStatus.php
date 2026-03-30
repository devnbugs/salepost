<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum SaleStatus: string
{
    use HasOptions;

    case Draft = 'draft';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
