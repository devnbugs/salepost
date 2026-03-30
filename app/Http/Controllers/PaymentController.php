<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function store(StorePaymentRequest $request, PaymentService $paymentService): RedirectResponse
    {
        $paymentService->record($request->validated(), $request->user());

        return back()->with('success', 'Payment recorded successfully.');
    }
}
