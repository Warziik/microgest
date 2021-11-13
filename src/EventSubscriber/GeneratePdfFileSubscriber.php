<?php
namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Email\DevisEmail;
use App\Entity\Devis;
use App\Entity\Invoice;
use App\Email\InvoiceEmail;
use http\Exception\InvalidArgumentException;
use http\Exception\RuntimeException;
use Knp\Snappy\Pdf;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;
use Twig\Environment;

final class GeneratePdfFileSubscriber implements EventSubscriberInterface {

    public function __construct(
        private Security $security,
        private InvoiceEmail $invoiceEmail,
        private DevisEmail $devisEmail,
        private Pdf $pdf,
        private Environment $twig
    ) {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => [
                ["onPreWrite", EventPriorities::PRE_WRITE],
                ["onPostWrite", EventPriorities::POST_WRITE]
            ]
        ];
    }

    public function onPreWrite(ViewEvent $event): void {
        if ($this->isExpectedEntity($event)) {
            $entity = $event->getControllerResult();

            $pdfName = uniqid() . ".pdf";
            $tmpFilePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $pdfName;

            if ($entity instanceof Invoice) {
                $twigView = $this->twig->render("pdf/invoice.html.twig", ["invoice" => $entity]);
            } elseif ($entity instanceof Devis) {
                $twigView = $this->twig->render("pdf/devis.html.twig", ["devis" => $entity]);
            } else {
                throw new InvalidArgumentException("Une facture ou un devis est nécessaire.");
            }

            $this->pdf->generateFromHtml(
                $twigView,
                $tmpFilePath,
                [],
                true
            );

            $file = new UploadedFile(
                $tmpFilePath,
                $pdfName,
                "application/pdf",
                null,
                true
            );
            $entity->setFile($file);
        }
    }

    public function onPostWrite(ViewEvent $event): void {
        if ($this->isExpectedEntity($event)) {
            $entity = $event->getControllerResult();
            if ($entity instanceof Invoice) {
                $this->invoiceEmail->sendInvoiceCreatedEmail($this->security->getUser(), $entity);
            } elseif ($entity instanceof Devis) {
                $this->devisEmail->sendDevisCreatedEmail($this->security->getUser(), $entity);
            } else {
                throw new RuntimeException("Une facture ou un devis est attendue.");
            }
        }
    }

    private function isExpectedEntity(ViewEvent $event): bool {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        return ($entity instanceof Invoice || $entity instanceof Devis) && ($method === Request::METHOD_POST || $method === Request::METHOD_PUT)
            && $entity->getIsDraft() === false && $entity->getUndraftedAt() !== null;
    }
}