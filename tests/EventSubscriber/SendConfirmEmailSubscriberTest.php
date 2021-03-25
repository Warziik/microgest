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
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, SendConfirmEmailSubscriber::getSubscribedEvents());
    }

    public function testSetConfirmationToken(): void
    {
        $user = $this->createMock(User::class);
        $user->expects($this->once())->method("setConfirmationToken");

        $userNotification = $this->createMock(UserNotification::class);
        $userNotification->expects($this->once())->method("sendConfirmAccountEmail");

        $kernel = $this->createMock(HttpKernelInterface::class);
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $event = new ViewEvent($kernel, $request, 1, $user);

        $subscriber = new SendConfirmEmailSubscriber($userNotification);
        $subscriber->onKernelView($event);
    }
}