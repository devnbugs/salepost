<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum PurchaseStatus: string
{
    use HasOptions;

    case Draft = 'draft';
    case Received = 'received';
    case Cancelled = 'cancelled';
}
