<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Branch;
use App\Models\User;
use App\Support\PermissionMatrix;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->with(['branch', 'roles', 'permissions'])
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->toString();
                $query->where(function ($builder) use ($search): void {
                    $builder
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => PermissionMatrix::roles(),
            'permissions' => PermissionMatrix::permissions(),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('Users/Form', [
            'user' => null,
            'roles' => PermissionMatrix::roles(),
            'permissions' => PermissionMatrix::permissions(),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::query()->create([
            'branch_id' => $data['branch_id'] ?? $request->user()->branch_id,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'job_title' => $data['job_title'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'password' => $data['password'],
        ]);

        $user->assignRole($data['role']);

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        return Inertia::render('Users/Show', [
            'user' => $user->load(['branch', 'roles', 'permissions']),
        ]);
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('Users/Form', [
            'user' => $user->load(['roles', 'permissions']),
            'roles' => PermissionMatrix::roles(),
            'permissions' => PermissionMatrix::permissions(),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validated();

        $user->fill([
            'branch_id' => $data['branch_id'] ?? $user->branch_id,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'job_title' => $data['job_title'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();
        $user->syncRoles([$data['role']]);

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        if ($user->id === request()->user()->id) {
            return redirect()
                ->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
