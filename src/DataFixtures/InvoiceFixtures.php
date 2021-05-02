<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Invoice;
use DateTime;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class InvoiceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create("fr_FR");

        $c = 1;
        for ($index = 0; $index < 300; $index++) {
            $i = new Invoice();

            $i->setChrono(date('Y') . "-" . str_pad($c, 6, "0", STR_PAD_LEFT));
            $i->setStatus($faker->randomElement(["NEW", "SENT", "PAID", "CANCELLED"]));
            $i->setTvaApplicable($faker->randomElement([true, false]));
            $i->setServiceDoneAt($faker->dateTimeBetween("-2 weeks", "-1 week"));
            $i->setPaymentDeadline(new DateTime("+30 days"));
            $i->setPaymentDelayRate($faker->randomElement([5, 10, 15, 20, null]));
            $i->setSentAt($i->getStatus() === "SENT" ? $faker->dateTimeBetween("-6 days", "now") : null);
            $i->setPaidAt($i->getStatus() === "PAID" ? $faker->dateTimeBetween("-1 day", "now") : null);
            $i->setCreatedAt(new DateTime());
            $i->setCustomer(
                $index === 0 ?
                    $this->getReference("testCustomer")
                    :
                    $this->getReference("customer-" . rand(1, 200))
            );

            $manager->persist($i);
            $c++;

            $this->addReference("invoice-$index", $i);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [CustomerFixtures::class];
    }
}
