<?php

namespace App\Policies;

class InvoicePolicy extends PermissionPolicy
{
    protected string $permissionPrefix = 'invoices';
}
