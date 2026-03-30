<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #0f172a;
            font-size: 12px;
        }
        .header, .summary, .footer {
            margin-bottom: 24px;
        }
        .title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 6px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: left;
        }
        th {
            background: #f8fafc;
        }
        .totals td {
            border: none;
            padding: 4px 0;
        }
        .right {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{ $business['business_name'] ?? 'Salepost Scrap Yard' }}</div>
        <div>{{ $business['business_address'] ?? '' }}</div>
        <div>{{ $business['phone'] ?? '' }} {{ $business['email'] ? '| '.$business['email'] : '' }}</div>
        <h2>Invoice {{ $invoice->invoice_number }}</h2>
        <div>Date: {{ optional($invoice->invoice_date)->format('M d, Y') }}</div>
        <div>Customer: {{ $invoice->customer?->name ?? 'Walk-in customer' }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Material</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->sale->items as $item)
                <tr>
                    <td>{{ $item->product?->name }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ number_format((float) $item->unit_price, 2) }}</td>
                    <td class="right">{{ number_format((float) $item->total_amount, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <table class="totals">
            <tr>
                <td>Total Amount</td>
                <td class="right">{{ number_format((float) $invoice->total_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Amount Paid</td>
                <td class="right">{{ number_format((float) $invoice->amount_paid, 2) }}</td>
            </tr>
            <tr>
                <td>Balance Due</td>
                <td class="right">{{ number_format((float) $invoice->balance_due, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Thank you for doing business with us.</p>
    </div>
</body>
</html>
