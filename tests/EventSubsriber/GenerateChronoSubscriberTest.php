<?php

namespace App\Tests\EventSubsriber;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\UserFixtures;
use App\Entity\Invoice;
use App\Entity\Customer;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use App\Repository\InvoiceRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use App\EventSubscriber\GenerateChronoSubscriber;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use App\EventSubscriber\PasswordEncoderSubscriber;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class GenerateChronoSubscriberTest extends ApiTestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, PasswordEncoderSubscriber::getSubscribedEvents());
    }

    public function testGenerateChrono(): void
    {
        $invoice = (new Invoice())
            ->setAmount(300)
            ->setStatus("NEW")
            ->setCustomer(new Customer());

        $securityMock = $this->getMockBuilder(Security::class)->disableOriginalConstructor()->getMock();
        $securityMock->expects($this->once())->method('getUser')->willReturn(new User());

        $repositoryMock = $this->getMockBuilder(InvoiceRepository::class)->disableOriginalConstructor()->getMock();
        $repositoryMock->expects($this->once())->method('findLastChrono');

        $subscriber = new GenerateChronoSubscriber($securityMock, $repositoryMock);

        $kernel = $this->getMockBuilder(HttpKernelInterface::class)->getMock();
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $event = new ViewEvent($kernel, $request, 1, $invoice);

        $subscriber->onKernelView($event);
    }
}
