<?php

namespace App\Tests\EventSubscriber;

use App\Entity\User;
use App\EventSubscriber\PasswordEncoderSubscriber;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, PasswordEncoderSubscriber::getSubscribedEvents());
    }

    /**
     * Verify that the PasswordEncoderSubsriber is called at the right moment
     * and that the encodePassword() method of the UserPasswordEncoderInterface is called one time.
     */
    public function testEncodePassword(): void
    {
        $user = $this->createMock(User::class);
        $user->expects($this->once())->method('setPassword');
        $user->expects($this->once())->method('getPassword')->willReturn('test');

        $passwordEncoder = $this->createMock(UserPasswordEncoderInterface::class);
        $passwordEncoder->expects($this->once())->method('encodePassword')->willReturn('foo');

        $kernel = $this->createMock(HttpKernelInterface::class);
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $event = new ViewEvent($kernel, $request, 1, $user);

        $subscriber = new PasswordEncoderSubscriber($passwordEncoder);
        $subscriber->onKernelView($event);
    }
}
