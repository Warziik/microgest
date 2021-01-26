<?php

namespace App\DataFixtures;

use App\Entity\Invoice;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class InvoiceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $statuses = ["NEW", "SENT", "PAID", "CANCELLED"];

        $testInvoice = (new Invoice())
            ->setChrono(date('Y') . "-0001")
            ->setAmount(rand(200, 4234))
            ->setStatus($statuses[rand(0, 3)])
            ->setSentAt(new DateTime())
            ->setCustomer($this->getReference("testCustomer"));
        $testInvoice->setPaidAt($testInvoice->getStatus() === "PAID" ? new DateTime() : null);

        $manager->persist($testInvoice);

        $chrono = 2;
        for ($i = 0; $i < 300; $i++) {
            $invoice = (new Invoice())
                ->setChrono(date('Y') . "-" . str_pad($chrono, 4, "0", STR_PAD_LEFT))
                ->setAmount(rand(200, 4234))
                ->setStatus($statuses[rand(0, 3)])
                ->setSentAt(new DateTime())
                ->setCustomer($this->getReference("customer-" . rand(0, 199)));
            $invoice->setPaidAt($invoice->getStatus() === "PAID" ? new DateTime() : null);

            $manager->persist($invoice);
            $chrono++;
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [CustomerFixtures::class];
    }
}
