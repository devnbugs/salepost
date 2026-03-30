<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum CashTransactionDirection: string
{
    use HasOptions;

    case Inflow = 'inflow';
    case Outflow = 'outflow';
}
