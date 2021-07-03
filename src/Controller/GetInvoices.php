<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\InvoiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Security;

#[AsController]
class GetInvoices extends AbstractController
{
    public function __construct(private Security $security, private InvoiceRepository $invoiceRepository)
    {
    }

    public function __invoke()
    {
        $invoices = [];

        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return;
        }

        foreach ($user->getCustomers() as $customer) {
            foreach ($customer->getInvoices() as $invoice) {
                $invoices[] = $invoice;
            }
        }

        return $invoices;
    }
}
