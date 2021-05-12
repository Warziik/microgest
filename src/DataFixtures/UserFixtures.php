<?php

namespace App\DataFixtures;

use App\Entity\User;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    public function __construct(private UserPasswordEncoderInterface $passwordEncoder)
    {
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create("fr_FR");

        for ($i = 0; $i <= 50; $i++) {
            $u = new User();
            $u->setFirstname($faker->firstName);
            $u->setLastname($faker->lastName);
            $u->setEmail($i === 0 ? "testUser@localhost.dev" : $faker->email);
            $u->setPhone($faker->randomElement([null, $faker->phoneNumber]));
            $u->setPassword($this->passwordEncoder->encodePassword($u, "demo1234"));
            $u->setCreatedAt(new DateTime());
            $u->setConfirmationToken(null);
            $u->setConfirmedAt($faker->dateTimeBetween("now", "+1 week"));
            $u->setBusinessName($faker->randomElement([null, $faker->company]));
            $u->setSiret("12345678914253");
            $u->setTvaNumber($faker->randomElement([null, "FR25123456789"]));
            $u->setAddress($faker->streetAddress);
            $u->setCity($faker->city);
            $u->setPostalCode((int) $faker->postcode);
            $u->setCountry($faker->countryISOAlpha3);

            if ($i === 1) {
                $u->setEmail("demoUser-$i@localhost.dev");
                $u->setCreatedAt(new DateTime("-2 weeks"));
                $u->setConfirmationToken(sha1(random_bytes(rand(8, 10))));
                $u->setConfirmedAt(null);
            }

            $manager->persist($u);

            $i === 0 ? $this->addReference("testUser", $u) : $this->addReference("user-$i", $u);
        }

        $manager->flush();
    }
}
