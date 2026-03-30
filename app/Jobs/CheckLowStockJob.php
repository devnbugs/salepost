<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\User;
use App\Notifications\LowStockAlertNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Notification;

class CheckLowStockJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public ?int $branchId = null,
    ) {
    }

    public function handle(): void
    {
        $products = Product::query()
            ->when($this->branchId, fn ($query) => $query->where('branch_id', $this->branchId))
            ->lowStock()
            ->limit(10)
            ->get();

        if ($products->isEmpty()) {
            return;
        }

        Notification::send(
            User::query()->role(['owner', 'manager'])->get(),
            new LowStockAlertNotification($products, $this->branchId),
        );
    }
}
