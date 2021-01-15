<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    private UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        for ($i = 0; $i < 50; $i++) {
            $user = new User();
            $user->setFirstname("FirstName-$i")
                ->setLastname("LastName-$i")
                ->setEmail("demoUser-$i@localhost.dev")
                ->setPassword($this->passwordEncoder->encodePassword($user, "demo1234"));

            $manager->persist($user);
        }

        $manager->flush();
    }
}
