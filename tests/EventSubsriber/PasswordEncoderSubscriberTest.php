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

    /**
     * Verify that the PasswordEncoderSubsriber is called at the right moment
     * and that the encodePassword() method of the UserPasswordEncoderInterface is called one time.
     */
    public function testEncodePassword(): void
    {
        $user = (new User())
            ->setFirstname("test")
            ->setLastname("test")
            ->setEmail("test@test.fr")
            ->setPassword("demo1234");

        $passwordEncoder = $this->getMockBuilder(UserPasswordEncoderInterface::class)->getMock();
        $passwordEncoder->expects($this->once())->method("encodePassword")->willReturn("foo");
        $subscriber = new PasswordEncoderSubscriber($passwordEncoder);

        $kernel = $this->getMockBuilder(HttpKernelInterface::class)->getMock();
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $event = new ViewEvent($kernel, $request, 1, $user);

        $subscriber->onKernelView($event);
    }
}
