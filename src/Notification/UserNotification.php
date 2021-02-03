<?php

namespace App\Notification;

use App\Entity\ResetPassword;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpClient\Exception\TransportException;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

final class UserNotification
{
    public function __construct(private MailerInterface $mailer)
    {
    }

    public function sendResetPasswordMail(User $user, ResetPassword $resetPassword): void
    {
        $email = (new TemplatedEmail())
            ->from('noreply@localhost.dev')
            ->to($user->getEmail())
            ->subject('Microgest - Reset password')
            ->htmlTemplate('emails/resetPassword.html.twig')
            ->context(compact('user', 'resetPassword'));

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            throw new TransportException($e->getMessage());
        }
    }
}
