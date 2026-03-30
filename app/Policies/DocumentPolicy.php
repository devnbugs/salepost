<?php

namespace App\Policies;

class DocumentPolicy extends PermissionPolicy
{
    protected string $permissionPrefix = 'documents';
}
