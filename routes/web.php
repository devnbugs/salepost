<?php

use App\Http\Controllers\CashTransactionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'))->middleware('auth');

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('products', ProductController::class);
    Route::post('products/{product}/adjust-stock', [ProductController::class, 'adjustStock'])->name('products.adjust-stock');

    Route::resource('customers', CustomerController::class);
    Route::resource('suppliers', SupplierController::class);

    Route::resource('sales', SaleController::class)->only(['index', 'create', 'store', 'show']);
    Route::resource('invoices', InvoiceController::class)->only(['index', 'show']);
    Route::get('invoices/{invoice}/download', [InvoiceController::class, 'download'])->name('invoices.download');
    Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');

    Route::resource('cash-transactions', CashTransactionController::class)->only(['index', 'create', 'store']);
    Route::resource('purchases', PurchaseController::class)->only(['index', 'create', 'store', 'show']);

    Route::resource('documents', DocumentController::class)->only(['index', 'create', 'store', 'show']);
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::patch('settings', [SettingController::class, 'update'])->name('settings.update');

    Route::resource('users', UserController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
