<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum PaymentMethod: string
{
    use HasOptions;

    case Cash = 'cash';
    case BankTransfer = 'bank_transfer';
    case MobileTransfer = 'mobile_transfer';
    case Pos = 'pos';
    case Cheque = 'cheque';
    case Other = 'other';
}
