<?php

namespace App\Tests\EventSubscriber;

use App\Entity\User;
use App\EventSubscriber\PasswordHasherSubscriber;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;

class PasswordHasherSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, PasswordHasherSubscriber::getSubscribedEvents());
    }

    /**
     * Verify that the PasswordEncoderSubsriber is called at the right moment
     * and that the encodePassword() method of the UserPasswordEncoderInterface is called one time.
     */
    public function testHashPassword(): void
    {
        $user = $this->createMock(User::class);
        $user->expects($this->once())->method('setPassword');
        $user->expects($this->once())->method('getPassword')->willReturn('test');

        $passwordHasher = $this->createMock(UserPasswordHasher::class);
        $passwordHasher->expects($this->once())->method('hashPassword')->willReturn('foo');

        $kernel = $this->createMock(HttpKernelInterface::class);
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $event = new ViewEvent($kernel, $request, 1, $user);

        $subscriber = new PasswordHasherSubscriber($passwordHasher);
        $subscriber->onKernelView($event);
    }
}
