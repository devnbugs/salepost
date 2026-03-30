<?php

namespace App\Policies;

class SettingPolicy extends PermissionPolicy
{
    protected string $permissionPrefix = 'settings';
}
