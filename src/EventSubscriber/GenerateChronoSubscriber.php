<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Devis;
use App\Entity\Invoice;
use App\Repository\DevisRepository;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

final class GenerateChronoSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private Security $security,
        private InvoiceRepository $invoiceRepository,
        private DevisRepository $devisRepository
    ) {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['onKernelView', EventPriorities::PRE_WRITE],
        ];
    }

    /**
     * Generate a unique chrono for each Invoice before persisting in database.
     */
    public function onKernelView(ViewEvent $event)
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (($entity instanceof Invoice || $entity instanceof Devis) && Request::METHOD_POST === $method) {
            $isInvoice = $entity instanceof Invoice;

            if ($isInvoice) {
                $lastChrono = $this->invoiceRepository->findLastChrono($this->security->getUser());
            } else {
                $lastChrono = $this->devisRepository->findLastChrono($this->security->getUser());
            }

            if (
                is_null($lastChrono) ||
                !preg_match("/^(F|D)-(\d{4})-(\d{6})$/", $lastChrono)
            ) {
                if ($isInvoice) {
                    $lastChrono = "F-" . date('Y') . '-000000';
                } else {
                    $lastChrono = "D-" . date('Y') . '-000000';
                }
            }

            $chronoValues = explode('-', $lastChrono);
            if ($chronoValues[1] !== date('Y')) {
                $chronoValues[0] = $isInvoice ? 'F-' : 'D-';
                $chronoValues[1] = date('Y');
                $chronoValues[2] = '000000';
            }

            $chrono = $chronoValues[0]
            . '-' . $chronoValues[1]
            . '-' . str_pad(intval($chronoValues[2]) + 1, 6, '0', STR_PAD_LEFT);

            $entity->setChrono($chrono);
        }
    }
}
