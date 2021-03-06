<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

final class GenerateChronoSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security, private InvoiceRepository $repository)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ["onKernelView", EventPriorities::PRE_WRITE],
        ];
    }

    /**
     * Generate a unique chrono for each Invoice before persisting in database.
     * 
     * @param ViewEvent $event
     */
    public function onKernelView(ViewEvent $event)
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($entity instanceof Invoice && $method === "POST") {
            $lastChrono = $this->repository->findLastChrono($this->security->getUser());
            if (is_null($lastChrono) || !preg_match("/^[0-9]{4}-[0-9]{4}$/", $lastChrono)) {
                $lastChrono = date("Y") . "-0000";
            }

            $chronoValues = explode("-", $lastChrono);
            if ($chronoValues[0] !== date("Y")) {
                $chronoValues[0] = date("Y");
                $chronoValues[1] = "0000";
            }

            $chrono = $chronoValues[0] . "-" . str_pad(intval($chronoValues[1]) + 1, 4, "0", STR_PAD_LEFT);
            $entity->setChrono($chrono);
        }
    }
}
