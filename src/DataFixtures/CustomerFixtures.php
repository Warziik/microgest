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
            $c = new Customer();
            $c->setType($faker->randomElement(["PERSON", "COMPANY"]));
            $c->setFirstname($c->getType() === "PERSON" ? $faker->firstName : null);
            $c->setLastname($c->getType() === "PERSON" ? $faker->lastName : null);
            $c->setEmail($faker->email);
            $c->setPhone($faker->phoneNumber);
            $c->setCompany($i === 0 || $c->getType() === "PERSON" ? "" : $faker->company);
            $c->setSiret($c->getType() === "PERSON" ? null : "12345678914253");
            $c->setAddress($faker->streetAddress);
            $c->setCity($faker->city);
            $c->setPostalCode((int) $faker->postcode);
            $c->setCountry($faker->countryISOAlpha3);
            $c->setCreatedAt($faker->dateTimeBetween("-9 days", "now"));
            $c->setOwner($i === 0 ? $this->getReference("testUser") : $this->getReference("user-" . rand(1, 50)));

            $manager->persist($c);
            $i === 0 ? $this->addReference("testCustomer", $c) : $this->addReference("customer-$i", $c);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [UserFixtures::class];
    }
}
