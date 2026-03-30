<?php

namespace App\Events;

use App\Models\Purchase;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PurchaseRecorded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Purchase $purchase,
    ) {
    }
}
