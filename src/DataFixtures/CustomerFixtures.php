<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CustomerFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i <= 200; ++$i) {
            $c = new Customer();
            $c->setType($faker->randomElement(['PERSON', 'COMPANY']));
            $c->setFirstname('PERSON' === $c->getType() ? $faker->firstName() : null);
            $c->setLastname('PERSON' === $c->getType() ? $faker->lastName() : null);
            $c->setEmail($faker->email());
            $c->setPhone($faker->phoneNumber());
            $c->setCompany(0 === $i || 'PERSON' === $c->getType() ? '' : $faker->company());
            $c->setSiret('PERSON' === $c->getType() ? null : 12345678914253);
            $c->setAddress($faker->streetAddress());
            $c->setCity($faker->city());
            $c->setPostalCode((int) $faker->postcode());
            $c->setCountry($faker->countryISOAlpha3());
            $c->setCreatedAt($faker->dateTimeBetween('-9 days', 'now'));
            $c->setOwner(0 === $i ? $this->getReference('testUser') : $this->getReference('user-' . rand(1, 50)));

            $manager->persist($c);
            0 === $i ? $this->addReference('testCustomer', $c) : $this->addReference("customer-$i", $c);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [UserFixtures::class];
    }
}
