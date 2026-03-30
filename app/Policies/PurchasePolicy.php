<?php

namespace App\Policies;

class PurchasePolicy extends PermissionPolicy
{
    protected string $permissionPrefix = 'purchases';
}
