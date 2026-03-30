<?php

namespace App\Http\Controllers;

use App\Enums\DocumentType;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\CashTransaction;
use App\Models\Customer;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\Tag;
use App\Services\DocumentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Document::class);

        $documents = Document::query()
            ->with(['customer', 'supplier', 'sale', 'purchase', 'invoice', 'tags'])
            ->when($request->filled('document_type'), fn ($query) => $query->where('document_type', $request->string('document_type')->toString()))
            ->when($request->filled('reference_number'), fn ($query) => $query->where('reference_number', 'like', '%'.$request->string('reference_number')->toString().'%'))
            ->latest('document_date')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'filters' => $request->only(['document_type', 'reference_number']),
            'document_types' => DocumentType::options(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Document::class);

        return Inertia::render('Documents/Create', [
            'document_types' => DocumentType::options(),
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::query()->orderBy('name')->get(['id', 'name']),
            'sales' => Sale::query()->latest('sale_date')->limit(25)->get(['id', 'sale_number']),
            'purchases' => Purchase::query()->latest('purchase_date')->limit(25)->get(['id', 'purchase_number']),
            'invoices' => Invoice::query()->latest('invoice_date')->limit(25)->get(['id', 'invoice_number']),
            'cashTransactions' => CashTransaction::query()->latest('transaction_date')->limit(25)->get(['id', 'transaction_number']),
            'tags' => Tag::query()->orderBy('name')->get(['id', 'name', 'color']),
        ]);
    }

    public function store(StoreDocumentRequest $request, DocumentService $documentService): RedirectResponse
    {
        $document = $documentService->store(
            $request->validated(),
            $request->file('file'),
            $request->user(),
        );

        return redirect()
            ->route('documents.show', $document)
            ->with('success', 'Document uploaded successfully.');
    }

    public function show(Document $document): Response
    {
        $this->authorize('view', $document);

        return Inertia::render('Documents/Show', [
            'document' => $document->load([
                'customer',
                'supplier',
                'sale',
                'purchase',
                'invoice',
                'cashTransaction',
                'uploader',
                'tags',
            ]),
        ]);
    }

    public function download(Document $document): StreamedResponse
    {
        $this->authorize('view', $document);

        return Storage::disk($document->disk)->download($document->file_path, $document->file_name);
    }
}
