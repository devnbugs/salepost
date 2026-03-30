<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum DocumentType: string
{
    use HasOptions;

    case Invoice = 'invoice';
    case Receipt = 'receipt';
    case Contract = 'contract';
    case SupplierDocument = 'supplier_document';
    case PaymentProof = 'payment_proof';
    case SaleDocument = 'sale_document';
    case TransportDocument = 'transport_document';
    case IdDocument = 'id_document';
    case InternalMemo = 'internal_memo';
    case Miscellaneous = 'miscellaneous';
}
