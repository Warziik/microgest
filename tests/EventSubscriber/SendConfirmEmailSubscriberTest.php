<?php

namespace App\Tests\EventSubsriber;

use App\Entity\User;
use PHPUnit\Framework\TestCase;
use App\Notification\UserNotification;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use App\EventSubscriber\SendConfirmEmailSubscriber;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class SendConfirmEmailSubscriberTest extends TestCase
{
    private function getViewEvent(User $user): ViewEvent
    {
        $kernel = $this->createMock(HttpKernelInterface::class);
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        return new ViewEvent($kernel, $request, 1, $user);
    }

    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, SendConfirmEmailSubscriber::getSubscribedEvents());
    }

    public function testSetConfirmationToken(): void
    {
        $user = $this->createMock(User::class);
        $userNotification = $this->createMock(UserNotification::class);

        $user->expects($this->once())->method("setConfirmationToken");

        $event = $this->getViewEvent($user);
        $subscriber = new SendConfirmEmailSubscriber($userNotification);
        $subscriber->onPreWrite($event);
    }

    public function testSendEmail(): void
    {
        $user = $this->createMock(User::class);
        $userNotification = $this->createMock(UserNotification::class);

        $userNotification->expects($this->once())->method("sendConfirmAccountEmail");

        $event = $this->getViewEvent($user);
        $subscriber = new SendConfirmEmailSubscriber($userNotification);
        $subscriber->onPostWrite($event);
    }
}
