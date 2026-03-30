<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum SettlementStatus: string
{
    use HasOptions;

    case Unpaid = 'unpaid';
    case PartPaid = 'part_paid';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
}
