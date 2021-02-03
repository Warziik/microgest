<?php

namespace App\Tests\Notification;

use App\Entity\ResetPassword;
use App\Entity\User;
use App\Notification\UserNotification;
use PHPUnit\Framework\TestCase;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class UserNotificationTest extends TestCase
{
    public function testSendEmail(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $mailer->expects($this->once())
            ->method("send");

        $this->notify($mailer);
    }

    public function testValidEmail(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $mailer->expects($this->once())
            ->method("send")
            ->with($this->callback(function (TemplatedEmail $message) {
                return "foo@localhost.dev" === $message->getTo()[0]->getAddress() &&
                    array_key_exists("user", $message->getContext()) &&
                    array_key_exists("resetPassword", $message->getContext()) &&
                    "emails/resetPassword.html.twig" === $message->getHtmlTemplate();
            }));

        $this->notify($mailer);
    }

    private function notify($mailer): void
    {
        $user = $this->createMock(User::class);
        $user->expects($this->once())
            ->method("getEmail")
            ->willReturn("foo@localhost.dev");

        $resetPassword = $this->createMock(ResetPassword::class);
        $userNotification = new UserNotification($mailer);
        $userNotification->sendResetPasswordMail($user, $resetPassword);
    }
}
