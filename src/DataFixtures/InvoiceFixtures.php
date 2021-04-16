<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Invoice;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class InvoiceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create("fr_FR");

        $testInvoice = (new Invoice())
            ->setChrono(date('Y') . "-0001")
            ->setAmount($faker->randomFloat(2, 350, 9999))
            ->setService($faker->sentence(3))
            ->setStatus("SENT")
            ->setSentAt($faker->dateTimeBetween("-4 days", "now"))
            ->setCustomer($this->getReference("testCustomer"));

        $manager->persist($testInvoice);

        $chrono = 2;
        for ($i = 0; $i < 300; $i++) {
            $invoice = (new Invoice())
                ->setChrono(date('Y') . "-" . str_pad($chrono, 4, "0", STR_PAD_LEFT))
                ->setAmount($faker->randomFloat(2, 350, 9999))
                ->setService($faker->sentence(3))
                ->setStatus($faker->randomElement(["NEW", "SENT", "PAID", "CANCELLED"]))
                ->setCustomer($this->getReference("customer-" . rand(1, 200)));
            $invoice->setSentAt($invoice->getStatus() === "SENT" ? $faker->dateTimeBetween("-6 days", "now") : null);
            $invoice->setPaidAt($invoice->getStatus() === "PAID" ? $faker->dateTimeBetween("-1 day", "now") : null);

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
