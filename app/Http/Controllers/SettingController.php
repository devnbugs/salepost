<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingsRequest;
use App\Models\Branch;
use App\Services\SettingsService;
use App\Support\PermissionMatrix;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(Request $request, SettingsService $settingsService): Response
    {
        abort_unless($request->user()->can('settings.view'), 403);

        return Inertia::render('Settings/Index', [
            'business' => $settingsService->business($request->user()->branch_id),
            'theme' => $settingsService->theme($request->user()->branch_id),
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name']),
            'roles' => PermissionMatrix::roles(),
            'permissions' => PermissionMatrix::permissions(),
        ]);
    }

    public function update(
        UpdateSettingsRequest $request,
        SettingsService $settingsService,
    ): RedirectResponse {
        $branchId = $request->user()->branch_id;

        $settingsService->setGroup('business', [
            'business_name' => $request->validated('business_name'),
            'business_address' => $request->validated('business_address'),
            'phone' => $request->validated('phone'),
            'email' => $request->validated('email'),
            'currency' => $request->validated('currency'),
            'invoice_prefix' => $request->validated('invoice_prefix'),
            'allow_negative_stock' => $request->boolean('allow_negative_stock'),
        ], $branchId);

        $settingsService->setGroup('theme', [
            'default_theme' => $request->validated('default_theme'),
        ], $branchId);

        return redirect()
            ->route('settings.index')
            ->with('success', 'Settings updated successfully.');
    }
}
