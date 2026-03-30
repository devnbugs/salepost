<?php

namespace App\Policies;

class CashTransactionPolicy extends PermissionPolicy
{
    protected string $permissionPrefix = 'cash_transactions';
}
