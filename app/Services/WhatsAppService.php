<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;

class WhatsAppService
{
    public function __construct(
        private readonly SaleService $saleService,
        private readonly PurchaseService $purchaseService,
    ) {}

    /**
     * Handle incoming text message and return a rich string response.
     */
    public function handleMessage(string $incomingText, ?User $user = null): string
    {
        if (! $user) {
            // Pick any system admin or owner as default user for WhatsApp transactions
            $user = User::query()->first();
        }

        $text = trim($incomingText);
        if (empty($text)) {
            return $this->getHelpMessage();
        }

        $tokens = preg_split('/\s+/', $text);
        $command = strtoupper($tokens[0]);

        switch ($command) {
            case 'HELP':
            case 'HI':
            case 'HELLO':
            case 'START':
                return $this->getHelpMessage();

            case 'BAL':
                return $this->handleBalanceCommand(array_slice($tokens, 1));

            case 'STOCK':
                return $this->handleStockCommand(array_slice($tokens, 1));

            case 'SALE':
                return $this->handleSaleCommand(array_slice($tokens, 1), $user);

            case 'BUY':
                return $this->handleBuyCommand(array_slice($tokens, 1), $user);

            default:
                return "🤖 *Salepost Chatbot* \n\nAh, sorry boss, I didn't recognize that command: *\"{$command}\"*\n\nType *HELP* to see list of valid commands.";
        }
    }

    private function getHelpMessage(): string
    {
        return "🤖 *Salepost Scrap ERP Chatbot* 🇳🇬\n".
               "Manage your scrap yard directly from WhatsApp!\n\n".
               "━━━━━━━━━━━━━━━━\n".
               "🔑 *Available Commands:*\n\n".
               "1️⃣ *BAL [name_or_phone]*\n".
               "Check debt/payable balance of a customer or supplier.\n".
               "📝 _Example: BAL Alhaji_ \n\n".
               "2️⃣ *STOCK [material]*\n".
               "Query yard stock levels for scrap materials.\n".
               "📝 _Example: STOCK Karfe_ \n\n".
               "3️⃣ *SALE [phone] [material] [qty] [price]*\n".
               "Record bulk sale transaction directly from the scale.\n".
               "📝 _Example: SALE 08012345678 Aluminium 50 1800_ \n\n".
               "4️⃣ *BUY [phone] [material] [qty] [price]*\n".
               "Record supplier material intake into the inventory.\n".
               "📝 _Example: BUY 08087654321 Copper 120 4200_ \n\n".
               "━━━━━━━━━━━━━━━━\n".
               'Type *HELP* anytime to show this menu.';
    }

    private function handleBalanceCommand(array $args): string
    {
        if (empty($args)) {
            return "🤖 *Balance Directory* \n\nPlease provide a name or phone number.\n📝 _Example: BAL Alhaji_";
        }

        $term = implode(' ', $args);

        // Try to find customer
        $customers = Customer::query()
            ->where('name', 'like', "%{$term}%")
            ->orWhere('phone', 'like', "%{$term}%")
            ->orWhere('company_name', 'like', "%{$term}%")
            ->get();

        // Try to find supplier
        $suppliers = Supplier::query()
            ->where('name', 'like', "%{$term}%")
            ->orWhere('phone', 'like', "%{$term}%")
            ->orWhere('company_name', 'like', "%{$term}%")
            ->get();

        if ($customers->isEmpty() && $suppliers->isEmpty()) {
            return "🤖 *Balance Directory* \n\n❌ No customer or supplier found matching *\"{$term}\"*.";
        }

        $response = "🤖 *Balance Report for \"{$term}\"*:\n\n";

        if ($customers->isNotEmpty()) {
            $response .= "👤 *Customers (Debtors):*\n";
            foreach ($customers as $customer) {
                $status = is_numeric($customer->balance) && (float) $customer->balance > 0 ? '🔴 Owes us' : '🟢 Clear';
                $formattedBal = number_format((float) $customer->balance, 2);
                $response .= "• *{$customer->name}* ({$customer->phone}): \n  ₦{$formattedBal} ({$status})\n";
            }
            $response .= "\n";
        }

        if ($suppliers->isNotEmpty()) {
            $response .= "🤝 *Suppliers (Outstanding Payables):*\n";
            foreach ($suppliers as $supplier) {
                $status = is_numeric($supplier->balance) && (float) $supplier->balance > 0 ? '🟡 We owe them' : '🟢 Clear';
                $formattedBal = number_format((float) $supplier->balance, 2);
                $response .= "• *{$supplier->name}* ({$supplier->phone}): \n  ₦{$formattedBal} ({$status})\n";
            }
        }

        return trim($response);
    }

    private function handleStockCommand(array $args): string
    {
        if (empty($args)) {
            // List all active stocks
            $products = Product::query()->where('status', 'active')->orderBy('name')->get();
            $response = "🤖 *Live Yard Inventory Stock Levels:*\n\n";
            foreach ($products as $product) {
                $formattedStock = number_format((float) $product->current_stock, 1);
                $response .= "• *{$product->name}*: {$formattedStock} {$product->unit_of_measure}\n";
            }

            return $response;
        }

        $term = implode(' ', $args);
        $product = Product::query()
            ->where('name', 'like', "%{$term}%")
            ->orWhere('sku', 'like', "%{$term}%")
            ->first();

        if (! $product) {
            return "🤖 *Stock Query* \n\n❌ Scrap material matching *\"{$term}\"* was not found.";
        }

        $formattedStock = number_format((float) $product->current_stock, 1);
        $formattedPrice = number_format((float) $product->selling_price, 2);

        return "🤖 *Stock Query*:\n\n".
               "📦 *Material:* {$product->name}\n".
               "🏷️ *SKU/Code:* {$product->sku}\n".
               "📐 *Live Stock:* *{$formattedStock} {$product->unit_of_measure}*\n".
               "💰 *Current Price:* ₦{$formattedPrice} per {$product->unit_of_measure}";
    }

    private function handleSaleCommand(array $args, User $user): string
    {
        if (count($args) < 4) {
            return "🤖 *Direct Sale Recorder* \n\n❌ Invalid syntax. Please use:\n*SALE [phone] [material] [qty] [price]*\n📝 _Example: SALE 08012345678 Aluminium 50 1800_";
        }

        $phone = $args[0];
        $materialName = $args[1];
        $qty = (float) $args[2];
        $price = (float) $args[3];

        // 1. Find or create customer by phone
        $customer = Customer::query()->where('phone', $phone)->first();
        if (! $customer) {
            $customer = Customer::query()->create([
                'branch_id' => $user?->branch_id,
                'name' => 'WhatsApp Client '.substr($phone, -4),
                'phone' => $phone,
                'is_corporate' => false,
                'state' => 'Lagos',
            ]);
        }

        // 2. Find material by name
        $product = Product::query()
            ->where('name', 'like', "%{$materialName}%")
            ->orWhere('sku', 'like', "%{$materialName}%")
            ->first();

        if (! $product) {
            return "🤖 *Direct Sale Recorder* \n\n❌ Material matching *\"{$materialName}\"* was not found.";
        }

        try {
            // 3. Record transaction using SaleService
            $data = [
                'customer_id' => $customer->id,
                'status' => 'completed',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'unit_price' => $price,
                        'description' => 'Recorded via WhatsApp Chatbot',
                    ],
                ],
            ];

            $sale = $this->saleService->create($data, $user);
            $totalFormatted = number_format((float) $sale->total_amount, 2);

            return "🤖 *Sale Invoice Registered!* 🇳🇬\n\n".
                   "🧾 *Ticket Number:* {$sale->sale_number}\n".
                   "👤 *Customer:* {$customer->name}\n".
                   "📦 *Material:* {$product->name}\n".
                   "📐 *Quantity:* {$qty} {$product->unit_of_measure}\n".
                   '💰 *Price:* ₦'.number_format($price, 2)."\n".
                   "━━━━━━━━━━━━━━━━\n".
                   "💵 *Total Paid/Owed:* *₦{$totalFormatted}* \n\n".
                   'Ledger updated successfully. Boss, you are good to go!';
        } catch (\Exception $e) {
            return "🤖 *Sale Error* \n\n❌ Failed to write sale: ".$e->getMessage();
        }
    }

    private function handleBuyCommand(array $args, User $user): string
    {
        if (count($args) < 4) {
            return "🤖 *Direct Buy Recorder (Intake)* \n\n❌ Invalid syntax. Please use:\n*BUY [phone] [material] [qty] [price]*\n📝 _Example: BUY 08087654321 Copper 120 4200_";
        }

        $phone = $args[0];
        $materialName = $args[1];
        $qty = (float) $args[2];
        $price = (float) $args[3];

        // 1. Find or create supplier by phone
        $supplier = Supplier::query()->where('phone', $phone)->first();
        if (! $supplier) {
            $supplier = Supplier::query()->create([
                'branch_id' => $user?->branch_id,
                'name' => 'WhatsApp Supplier '.substr($phone, -4),
                'phone' => $phone,
                'is_corporate' => false,
                'state' => 'Kano',
            ]);
        }

        // 2. Find material by name
        $product = Product::query()
            ->where('name', 'like', "%{$materialName}%")
            ->orWhere('sku', 'like', "%{$materialName}%")
            ->first();

        if (! $product) {
            return "🤖 *Direct Buy Recorder* \n\n❌ Material matching *\"{$materialName}\"* was not found.";
        }

        try {
            // 3. Record purchase using PurchaseService
            $data = [
                'supplier_id' => $supplier->id,
                'status' => 'received',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'unit_cost' => $price,
                        'description' => 'Recorded via WhatsApp Chatbot',
                    ],
                ],
            ];

            $purchase = $this->purchaseService->create($data, $user);
            $totalFormatted = number_format((float) $purchase->total_amount, 2);

            return "🤖 *Purchase Recorded (Intake)!* 🇳🇬\n\n".
                   "🧾 *Receipt Number:* {$purchase->purchase_number}\n".
                   "🤝 *Supplier:* {$supplier->name}\n".
                   "📦 *Material:* {$product->name}\n".
                   "📐 *Quantity:* {$qty} {$product->unit_of_measure}\n".
                   '💰 *Unit Cost:* ₦'.number_format($price, 2)."\n".
                   "━━━━━━━━━━━━━━━━\n".
                   "💵 *Total Payable:* *₦{$totalFormatted}* \n\n".
                   'Stock levels automatically adjusted in yard ledger.';
        } catch (\Exception $e) {
            return "🤖 *Buy Error* \n\n❌ Failed to write intake purchase: ".$e->getMessage();
        }
    }
}
