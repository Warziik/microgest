<?php

namespace App\Notification;

use App\Entity\ResetPassword;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpClient\Exception\TransportException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class UserNotification
{
    public function __construct(private MailerInterface $mailer)
    {
    }

    public function sendResetPasswordMail(User $user, ResetPassword $resetPassword): void
    {
        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Microgest - Réinitialisation de mot de passe')
            ->htmlTemplate('emails/resetPassword.html.twig')
            ->context(compact('user', 'resetPassword'));

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            throw new TransportException($e->getMessage());
        }
    }

    public function sendConfirmAccountEmail(User $user): void
    {
        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Microgest - Confirmation de compte')
            ->htmlTemplate('emails/confirmAccount.html.twig')
            ->context(compact('user'));

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            throw new TransportException($e->getMessage());
        }
    }
}
