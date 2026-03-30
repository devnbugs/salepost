<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Services\SettingsService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Invoice::class);

        $invoices = Invoice::query()
            ->with(['customer', 'sale', 'payments'])
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->toString();
                $query->where(function ($builder) use ($search): void {
                    $builder
                        ->where('invoice_number', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($customer) => $customer->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest('invoice_date')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Invoice $invoice, SettingsService $settingsService): Response
    {
        $this->authorize('view', $invoice);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice->load([
                'sale.items.product',
                'customer',
                'issuer',
                'payments.cashTransaction',
                'documents',
            ]),
            'business' => $settingsService->business($invoice->branch_id),
        ]);
    }

    public function download(Invoice $invoice, SettingsService $settingsService): StreamedResponse
    {
        abort_unless(request()->user()->can('invoices.download'), 403);

        if ($invoice->pdf_path && Storage::disk('public')->exists($invoice->pdf_path)) {
            return Storage::disk('public')->download($invoice->pdf_path);
        }

        $invoice->load(['sale.items.product', 'customer', 'issuer', 'branch']);
        $business = $settingsService->business($invoice->branch_id);
        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'business' => $business,
        ]);

        return response()->streamDownload(
            fn () => print($pdf->output()),
            "{$invoice->invoice_number}.pdf",
        );
    }
}
