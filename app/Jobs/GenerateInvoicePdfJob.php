<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Services\SettingsService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class GenerateInvoicePdfJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $invoiceId,
    ) {
    }

    public function handle(): void
    {
        $invoice = Invoice::query()
            ->with(['sale.items.product', 'customer', 'issuer', 'branch'])
            ->find($this->invoiceId);

        if (! $invoice) {
            return;
        }

        $business = app(SettingsService::class)->business($invoice->branch_id);
        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'business' => $business,
        ]);

        $path = "invoices/{$invoice->invoice_number}.pdf";

        Storage::disk('public')->put($path, $pdf->output());

        $invoice->forceFill([
            'pdf_path' => $path,
        ])->save();
    }
}
