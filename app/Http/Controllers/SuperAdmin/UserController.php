<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Authorize that the authenticated user is an owner (super-admin).
     */
    private function authorizeOwner(): void
    {
        if (! auth()->user()?->isOwner()) {
            abort(403, 'Unauthorized Access to Command Deck.');
        }
    }

    /**
     * Display the super admin dashboard with user management and permissions matrix.
     */
    public function index(Request $request): Response
    {
        $this->authorizeOwner();

        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();

        // Count users by their role
        $superAdminsCount = User::whereHas('role', function ($query) {
            $query->where('slug', 'super-admin');
        })->orWhere('job_title', 'Owner')->count();

        $operatorsCount = User::whereHas('role', function ($query) {
            $query->where('slug', 'operator');
        })->orWhere('job_title', 'Operator')->count();

        $users = User::with(['role', 'branch'])->get();
        $branches = Branch::all(['id', 'name', 'code']);
        $roles = Role::all(['id', 'name', 'slug']);
        $permissions = Permission::with('roles')->get();
        $settings = Setting::all(['key', 'value', 'type', 'label', 'group']);

        return Inertia::render('super-admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'superAdminsCount' => $superAdminsCount,
                'operatorsCount' => $operatorsCount,
            ],
            'users' => $users,
            'branches' => $branches,
            'roles' => $roles,
            'permissions' => $permissions,
            'settings' => $settings,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorizeOwner();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
            'branch_id' => ['required', 'exists:branches,id'],
        ]);

        $role = Role::findOrFail($validated['role_id']);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'branch_id' => $validated['branch_id'],
            'job_title' => $role->name,
            'is_active' => true,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User registered successfully.'),
        ]);

        return back();
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorizeOwner();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role_id' => ['required', 'exists:roles,id'],
            'branch_id' => ['required', 'exists:branches,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        $role = Role::findOrFail($validated['role_id']);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
            'branch_id' => $validated['branch_id'],
            'job_title' => $role->name,
            'is_active' => $validated['is_active'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User updated successfully.'),
        ]);

        return back();
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorizeOwner();

        if ($user->id === auth()->id()) {
            abort(400, 'Self-deletion of authenticated super admin is blocked.');
        }

        $user->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User removed successfully.'),
        ]);

        return back();
    }

    /**
     * Sync permissions for a specific role.
     */
    public function syncPermissions(Request $request, Role $role): RedirectResponse
    {
        $this->authorizeOwner();

        $validated = $request->validate([
            'permission_ids' => ['present', 'array'],
            'permission_ids.*' => ['exists:permissions,id'],
        ]);

        $role->permissions()->sync($validated['permission_ids']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __(':role permissions synced successfully.', ['role' => $role->name]),
        ]);

        return back();
    }

    /**
     * Update global site settings in storage.
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $this->authorizeOwner();

        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string', 'exists:settings,key'],
            'settings.*.value' => ['present', 'nullable', 'string'],
        ]);

        foreach ($validated['settings'] as $item) {
            $setting = Setting::where('key', $item['key'])->first();
            if ($setting) {
                $setting->update([
                    'value' => $item['value'] ?? '',
                ]);
            }
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Global site settings updated successfully.'),
        ]);

        return back();
    }
}
