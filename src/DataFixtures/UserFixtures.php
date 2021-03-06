<?php

namespace App\DataFixtures;

use App\Entity\User;
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
            $user = new User();
            $user->setFirstname($faker->firstName)
                ->setLastname($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($this->passwordEncoder->encodePassword($user, "demo1234"))
                ->setCreatedAt($faker->dateTimeBetween("-2 weeks", "now"))
                ->setConfirmationToken(null)
                ->setConfirmedAt($faker->dateTimeBetween("-12 days", "now"));

            if ($i === 0) {
                $user->setEmail("testUser@localhost.dev");
            }
            if ($i === 1) {
                $user->setEmail("demoUser-$i@localhost.dev");
                $user->setConfirmationToken(sha1(random_bytes(rand(8, 10))));
                $user->setConfirmedAt(null);
            }
            
            $manager->persist($user);

            $i === 0 ? $this->addReference("testUser", $user) : $this->addReference("user-$i", $user);
        }

        $manager->flush();
    }
}
