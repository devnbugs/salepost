<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum StockMovementType: string
{
    use HasOptions;

    case Opening = 'opening';
    case Purchase = 'purchase';
    case Sale = 'sale';
    case AdjustmentIn = 'adjustment_in';
    case AdjustmentOut = 'adjustment_out';
    case Correction = 'correction';
    case ReturnIn = 'return_in';
    case ReturnOut = 'return_out';
}
