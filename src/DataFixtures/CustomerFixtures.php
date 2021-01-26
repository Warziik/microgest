<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\DataFixtures\UserFixtures;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class CustomerFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $testCustomer = new Customer();
        $testCustomer->setFirstname("testCustomer-firstname")
            ->setLastname("testCustomer-lastname")
            ->setEmail("testCustomer@localhost.dev")
            ->setCompany("")
            ->setOwner($this->getReference("testUser"));
        $manager->persist($testCustomer);
        $this->addReference("testCustomer", $testCustomer);

        for ($i = 0; $i < 200; $i++) {
            $customer = (new Customer())
                ->setFirstname("firstname-$i")
                ->setLastname("lastname-$i")
                ->setEmail("demoCustomer-$i@localhost.dev")
                ->setCompany("CustomerCompany-$i")
                ->setOwner($this->getReference("user-" . rand(0, 49)));

            $manager->persist($customer);
            $this->addReference("customer-$i", $customer);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [UserFixtures::class];
    }
}
