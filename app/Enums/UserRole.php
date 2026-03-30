<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum UserRole: string
{
    use HasOptions;

    case Owner = 'owner';
    case Manager = 'manager';
    case Cashier = 'cashier';
    case SalesStaff = 'sales_staff';
    case Storekeeper = 'storekeeper';
    case Viewer = 'viewer';
}
