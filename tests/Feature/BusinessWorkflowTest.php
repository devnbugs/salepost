<?php

namespace Tests\Feature;

use App\Enums\PaymentMethod;
use App\Enums\PurchaseStatus;
use App\Enums\SaleStatus;
use App\Enums\UserRole;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Tag;
use App\Services\SaleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class BusinessWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_completed_sale_reduces_stock_and_creates_invoice(): void
    {
        Queue::fake();
        Notification::fake();

        $branch = Branch::factory()->create();
        $owner = $this->createUserWithRole(UserRole::Owner, $branch);
        $customer = Customer::factory()->create(['branch_id' => $branch->id]);
        $product = Product::factory()->create([
            'branch_id' => $branch->id,
            'name' => 'Karfe',
            'slug' => 'karfe-test',
            'current_stock' => 150,
            'cost_price' => 420,
            'selling_price' => 650,
            'unit_of_measure' => 'kg',
        ]);
        $tag = Tag::factory()->create(['created_by' => $owner->id]);

        $response = $this->actingAs($owner)->post(route('sales.store'), [
            'branch_id' => $branch->id,
            'customer_id' => $customer->id,
            'sale_date' => now()->toDateString(),
            'due_date' => now()->addDays(2)->toDateString(),
            'status' => SaleStatus::Completed->value,
            'transport_fee' => 5000,
            'other_charges' => 0,
            'description' => 'Completed karfe sale',
            'notes' => 'Feature test sale flow',
            'tag_ids' => [$tag->id],
            'items' => [
                [
                    'product_id' => $product->id,
                    'description' => 'Karfe load',
                    'quantity' => 50,
                    'unit_price' => 650,
                    'discount_amount' => 0,
                ],
            ],
        ]);

        $response->assertRedirect();

        $sale = \App\Models\Sale::query()->with('invoice')->firstOrFail();

        $this->assertSame(100.0, (float) $product->fresh()->current_stock);
        $this->assertNotNull($sale->invoice);
        $this->assertSame(1, $sale->items()->count());
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type' => 'sale',
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'sale.created',
            'auditable_id' => $sale->id,
        ]);
    }

    public function test_received_purchase_increases_stock_and_updates_supplier_balance(): void
    {
        Queue::fake();
        Notification::fake();

        $branch = Branch::factory()->create();
        $owner = $this->createUserWithRole(UserRole::Owner, $branch);
        $supplier = Supplier::factory()->create(['branch_id' => $branch->id]);
        $product = Product::factory()->create([
            'branch_id' => $branch->id,
            'name' => 'Aluminium',
            'slug' => 'aluminium-test',
            'current_stock' => 20,
            'cost_price' => 500,
            'selling_price' => 850,
            'unit_of_measure' => 'kg',
        ]);

        $response = $this->actingAs($owner)->post(route('purchases.store'), [
            'branch_id' => $branch->id,
            'supplier_id' => $supplier->id,
            'purchase_date' => now()->toDateString(),
            'status' => PurchaseStatus::Received->value,
            'other_charges' => 0,
            'description' => 'Purchase intake test',
            'notes' => 'Feature test purchase flow',
            'items' => [
                [
                    'product_id' => $product->id,
                    'description' => 'Aluminium sacks',
                    'quantity' => 50,
                    'unit_cost' => 500,
                ],
            ],
            'payment' => [
                'payment_date' => now()->toDateString(),
                'method' => PaymentMethod::Cash->value,
                'amount' => 5000,
                'reference_number' => 'PUR-FEATURE-001',
                'notes' => 'Initial supplier payment',
            ],
        ]);

        $response->assertRedirect();

        $purchase = \App\Models\Purchase::query()->firstOrFail();

        $this->assertSame(70.0, (float) $product->fresh()->current_stock);
        $this->assertSame(1, $purchase->payments()->count());
        $this->assertSame(20000.0, (float) $supplier->fresh()->balance);
        $this->assertDatabaseHas('cash_transactions', [
            'purchase_id' => $purchase->id,
            'direction' => 'outflow',
        ]);
    }

    public function test_partial_payment_updates_invoice_sale_and_customer_balances(): void
    {
        Queue::fake();
        Notification::fake();

        $branch = Branch::factory()->create();
        $owner = $this->createUserWithRole(UserRole::Owner, $branch);
        $cashier = $this->createUserWithRole(UserRole::Cashier, $branch);
        $customer = Customer::factory()->create(['branch_id' => $branch->id]);
        $product = Product::factory()->create([
            'branch_id' => $branch->id,
            'name' => 'Copper',
            'slug' => 'copper-test',
            'current_stock' => 100,
            'cost_price' => 4500,
            'selling_price' => 6000,
            'unit_of_measure' => 'kg',
        ]);

        /** @var SaleService $saleService */
        $saleService = app(SaleService::class);

        $sale = $saleService->create([
            'branch_id' => $branch->id,
            'customer_id' => $customer->id,
            'sale_date' => now()->toDateString(),
            'due_date' => now()->addDays(3)->toDateString(),
            'status' => SaleStatus::Completed->value,
            'transport_fee' => 0,
            'other_charges' => 0,
            'description' => 'Invoice payment test sale',
            'items' => [
                [
                    'product_id' => $product->id,
                    'description' => 'Copper lot',
                    'quantity' => 10,
                    'unit_price' => 6000,
                    'discount_amount' => 0,
                ],
            ],
        ], $owner);

        $invoice = $sale->invoice()->firstOrFail();

        $response = $this
            ->actingAs($cashier)
            ->from(route('invoices.show', $invoice))
            ->post(route('payments.store'), [
                'branch_id' => $branch->id,
                'invoice_id' => $invoice->id,
                'customer_id' => $customer->id,
                'payment_date' => now()->toDateString(),
                'method' => PaymentMethod::BankTransfer->value,
                'amount' => 25000,
                'reference_number' => 'PAY-FEATURE-001',
                'notes' => 'Part payment received',
            ]);

        $response->assertRedirect(route('invoices.show', $invoice));

        $invoice->refresh();
        $sale->refresh();
        $customer->refresh();

        $this->assertSame(25000.0, (float) $invoice->amount_paid);
        $this->assertSame(35000.0, (float) $invoice->balance_due);
        $this->assertSame('part_paid', $invoice->status->value);
        $this->assertSame('part_paid', $sale->payment_status->value);
        $this->assertSame(35000.0, (float) $customer->balance);
        $this->assertDatabaseHas('cash_transactions', [
            'sale_id' => $sale->id,
            'direction' => 'inflow',
            'reference_number' => 'PAY-FEATURE-001',
        ]);
    }

    public function test_sales_staff_can_not_access_user_management(): void
    {
        $branch = Branch::factory()->create();
        $salesStaff = $this->createUserWithRole(UserRole::SalesStaff, $branch);

        $this->actingAs($salesStaff)
            ->get(route('users.index'))
            ->assertForbidden();
    }

    public function test_sale_can_not_reduce_stock_below_zero_when_override_is_disabled(): void
    {
        Queue::fake();
        Notification::fake();

        $branch = Branch::factory()->create();
        $owner = $this->createUserWithRole(UserRole::Owner, $branch);
        $customer = Customer::factory()->create(['branch_id' => $branch->id]);
        $product = Product::factory()->create([
            'branch_id' => $branch->id,
            'name' => 'Brass',
            'slug' => 'brass-test',
            'current_stock' => 5,
            'cost_price' => 3000,
            'selling_price' => 4000,
            'unit_of_measure' => 'kg',
        ]);

        $response = $this
            ->actingAs($owner)
            ->from(route('sales.create'))
            ->post(route('sales.store'), [
                'branch_id' => $branch->id,
                'customer_id' => $customer->id,
                'sale_date' => now()->toDateString(),
                'status' => SaleStatus::Completed->value,
                'items' => [
                    [
                        'product_id' => $product->id,
                        'description' => 'Brass load',
                        'quantity' => 10,
                        'unit_price' => 4000,
                        'discount_amount' => 0,
                    ],
                ],
            ]);

        $response->assertSessionHasErrors('items');
        $this->assertSame(5.0, (float) $product->fresh()->current_stock);
    }
}
