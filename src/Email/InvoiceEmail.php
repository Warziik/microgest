<?php

namespace App\Email;

use App\Entity\Invoice;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpClient\Exception\TransportException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

final class InvoiceEmail
{
    public function __construct(private MailerInterface $mailer) {
    }

    public function sendInvoiceCreatedEmail(User $user, Invoice $invoice): void
    {
        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Microgest - Nouvelle facture créée!')
            ->htmlTemplate('emails/newInvoiceCreated.html.twig')
            ->context(compact('user', 'invoice'))
            ->attach($invoice->getFile()->getContent(), $invoice->getFileName());

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            throw new TransportException($e->getMessage());
        }
    }
}
