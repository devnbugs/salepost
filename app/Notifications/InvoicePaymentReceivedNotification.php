<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoicePaymentReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Payment $payment,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('A payment was recorded in Salepost.')
            ->line("Payment number: {$this->payment->payment_number}")
            ->line("Amount: {$this->payment->amount}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'invoice_payment_received',
            'payment_id' => $this->payment->id,
            'payment_number' => $this->payment->payment_number,
            'invoice_id' => $this->payment->invoice_id,
            'amount' => (float) $this->payment->amount,
            'payment_date' => optional($this->payment->payment_date)->toDateString(),
        ];
    }
}
