<?php
namespace App\Email;

use App\Entity\Devis;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpClient\Exception\TransportException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

final class DevisEmail {
    public function __construct(private MailerInterface $mailer) {
    }

    public function sendDevisCreatedEmail(User $user, Devis $devis): void
    {
        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Microgest - Nouveau devis crée!')
            ->htmlTemplate('emails/newDevisCreated.html.twig')
            ->context(compact('user', 'devis'))
            ->attach($devis->getFile()->getContent(), $devis->getFileName());

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            throw new TransportException($e->getMessage());
        }
    }
}