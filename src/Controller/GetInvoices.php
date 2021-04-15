<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;

class GetInvoices
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
