<?php

namespace App\Tests\EventSubscriber;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use App\EventSubscriber\GenerateChronoSubscriber;
use App\Repository\InvoiceRepository;
use DateTime;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class GenerateChronoSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, GenerateChronoSubscriber::getSubscribedEvents());
    }

    public function testGenerateChrono(): void
    {
        $invoice = (new Invoice())
            ->setChrono('2021-000001')
            ->setStatus('NEW')
            ->setTvaApplicable(false)
            ->setServiceDoneAt(new DateTime('-1 week'))
            ->setPaymentDeadline(new DateTime('+40 days'))
            ->setPaymentDelayRate(3)
            ->setCreatedAt(new DateTime())
            ->setCustomer(new Customer());

        $securityMock = $this->createMock(Security::class);
        $securityMock->expects($this->once())->method('getUser')->willReturn(new User());

        $repositoryMock = $this->createMock(InvoiceRepository::class);
        $repositoryMock->expects($this->once())->method('findLastChrono');

        $subscriber = new GenerateChronoSubscriber($securityMock, $repositoryMock);

        $kernel = $this->createMock(HttpKernelInterface::class);
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $event = new ViewEvent($kernel, $request, 1, $invoice);

        $subscriber->onKernelView($event);
    }
}
