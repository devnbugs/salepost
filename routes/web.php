<?php

use App\Http\Controllers\Auth\FirebaseGoogleAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SuperAdmin\UserController as SuperAdminUserController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');
Route::post('/auth/firebase-google', [FirebaseGoogleAuthController::class, 'authenticate'])->name('auth.firebase-google');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/super-admin', [SuperAdminUserController::class, 'index'])->name('super-admin.dashboard');
    Route::post('/super-admin/users', [SuperAdminUserController::class, 'store'])->name('super-admin.users.store');
    Route::patch('/super-admin/users/{user}', [SuperAdminUserController::class, 'update'])->name('super-admin.users.update');
    Route::delete('/super-admin/users/{user}', [SuperAdminUserController::class, 'destroy'])->name('super-admin.users.destroy');
    Route::post('/super-admin/roles/{role}/permissions', [SuperAdminUserController::class, 'syncPermissions'])->name('super-admin.roles.permissions.sync');
    Route::post('/super-admin/settings', [SuperAdminUserController::class, 'updateSettings'])->name('super-admin.settings.update');
});

require __DIR__.'/settings.php';
