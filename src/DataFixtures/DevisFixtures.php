<?php

namespace App\DataFixtures;

use App\Entity\Devis;
use DateTime;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class DevisFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        $c = 1;
        for ($index = 0; $index < 100; ++$index) {
            $d = new Devis();

            $d->setChrono('D-' . date('Y') . '-' . str_pad($c, 6, '0', STR_PAD_LEFT));
            $d->setStatus($faker->randomElement(['NEW', 'SENT', 'SIGNED', 'CANCELLED']));
            $d->setWorkStartDate(new DateTime("+1 week"));
            $d->setWorkDuration("2 weeks");
            $d->setValidityDate(new DateTime("+30 days"));
            $d->setPaymentDeadline(new DateTime('+60 days'));
            $d->setPaymentDelayRate($faker->randomElement([5, 10, 15, 20, null]));
            $d->setSentAt('SENT' === $d->getStatus() ? $faker->dateTimeBetween('now', '+1 day') : null);
            $d->setSignedAt('SIGNED' === $d->getStatus() ? $faker->dateTimeBetween('+1 day', '+2 weeks') : null);
            $d->setCreatedAt(new DateTimeImmutable());
            $d->setTvaApplicable($faker->randomElement([true, false]));
            $d->setIsDraft(true);
            $d->setCustomer(
                0 === $index ?
                    $this->getReference('testCustomer')
                    :
                    $this->getReference('customer-' . rand(1, 40))
            );

            $manager->persist($d);
            ++$c;

            $this->addReference("devis-$index", $d);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [CustomerFixtures::class];
    }
}
