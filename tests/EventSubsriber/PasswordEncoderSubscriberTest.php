<?php

namespace App\Tests\EventSubsriber;

use App\Entity\User;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use App\EventSubscriber\PasswordEncoderSubscriber;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, PasswordEncoderSubscriber::getSubscribedEvents());
    }

    /*
    public function testEncodePassword(): void
    {
        $passwordEncoder = $this->getMockBuilder(UserPasswordEncoderInterface::class)->disableOriginalConstructor()->getMock();
        $passwordEncoder->expects($this->once())->method("encodePassword");

        $subscriber = new PasswordEncoderSubscriber($passwordEncoder);
        $kernel = $this->getMockBuilder(HttpKernelInterface::class)->getMock();
        $user = (new User())
            ->setFirstname("test")
            ->setLastname("test")
            ->setEmail("test@test.fr")
            ->setPassword("demo1234");

        $request = new Request();
        $request->setMethod("POST");
        $event = new ViewEvent($kernel, $request, 1, $user);

        $subscriber->onKernelView($event);
    }
    */
}
