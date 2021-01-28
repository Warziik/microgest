<?php

namespace App\Tests\EventSubsriber;

use App\Entity\Customer;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use App\EventSubscriber\AddLoggedUserToCustomerSubscriber;

class AddLoggedUserToCustomerSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, AddLoggedUserToCustomerSubscriber::getSubscribedEvents());
    }

    /**
     * Verify that the AddLoggedUserToCustomerSubscriber is called at the right moment
     * and that the getUser() method of the Security is called one time.
     */
    public function testAddLoggedUserToCustomer(): void
    {
        $customer = (new Customer())
            ->setFirstname("test")
            ->setLastname("test")
            ->setEmail("test@localhost.dev");

        $securityMock = $this->getMockBuilder(Security::class)->disableOriginalConstructor()->getMock();
        $securityMock->expects($this->once())->method('getUser');

        $subscriber = new AddLoggedUserToCustomerSubscriber($securityMock);

        $kernel = $this->getMockBuilder(HttpKernelInterface::class)->getMock();
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $event = new ViewEvent($kernel, $request, 1, $customer);

        $subscriber->onKernelView($event);
    }
}
