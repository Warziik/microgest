<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Customer;
use App\DataFixtures\UserFixtures;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class CustomerFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create("fr_FR");

        for ($i = 0; $i <= 200; $i++) {
            $customer = (new Customer())
                ->setFirstname($faker->firstName)
                ->setLastname($faker->lastName)
                ->setEmail($faker->email)
                ->setCompany($i === 0 ? "" : $faker->company)
                ->setCreatedAt($faker->dateTimeBetween("-9 days", "now"))
                ->setOwner($i === 0 ? $this->getReference("testUser") : $this->getReference("user-" . rand(1, 50)));
                
            $manager->persist($customer);
            $i === 0 ? $this->addReference("testCustomer", $customer) : $this->addReference("customer-$i", $customer);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [UserFixtures::class];
    }
}
