<?php

namespace App\Policies;

class SalePolicy extends PermissionPolicy
{
    protected string $permissionPrefix = 'sales';
}
