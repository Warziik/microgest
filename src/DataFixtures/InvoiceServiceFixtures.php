<?php

namespace App\DataFixtures;

use App\Entity\InvoiceService;
use Faker\Factory;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class InvoiceServiceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create("fr_FR");

        for ($index = 0; $index < 300; $index++) {
            $i = new InvoiceService();
            $i->setName($faker->sentence(4));
            $i->setDescription($faker->randomElement([null, $faker->sentence(8)]));
            $i->setQuantity($faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
            $i->setUnitPrice($faker->randomFloat(2, 50, 10000));
            $i->setInvoice($this->getReference("invoice-$index"));

            $manager->persist($i);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [InvoiceFixtures::class];
    }
}
