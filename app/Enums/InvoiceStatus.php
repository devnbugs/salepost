<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum InvoiceStatus: string
{
    use HasOptions;

    case Draft = 'draft';
    case Issued = 'issued';
    case PartPaid = 'part_paid';
    case Paid = 'paid';
    case Overdue = 'overdue';
    case Cancelled = 'cancelled';
}
