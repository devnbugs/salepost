<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class LowStockAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Collection $products,
        public ?int $branchId = null,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('Low stock materials need attention.')
            ->line("Count: {$this->products->count()}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'low_stock_alert',
            'branch_id' => $this->branchId,
            'count' => $this->products->count(),
            'products' => $this->products->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'current_stock' => $product->current_stock,
                'reorder_level' => $product->reorder_level,
            ])->all(),
        ];
    }
}
