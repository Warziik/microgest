<?php

namespace App\Tests\EventSubsriber;

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
use Symfony\Component\HttpKernel\HttpKernelInterface;

class GenerateChronoSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::VIEW, GenerateChronoSubscriber::getSubscribedEvents());
    }

    public function testGenerateChrono(): void
    {
        $invoice = (new Invoice())
            ->setAmount(300)
            ->setStatus("NEW")
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
