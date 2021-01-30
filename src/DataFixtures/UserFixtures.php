<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    public function __construct(private UserPasswordEncoderInterface $passwordEncoder)
    {
    }

    public function load(ObjectManager $manager)
    {
        $testUser = new User();
        $testUser->setFirstname("testUser-firstname")
            ->setLastname("testUser-lastname")
            ->setEmail("testUser@localhost.dev")
            ->setPassword($this->passwordEncoder->encodePassword($testUser, "demo1234"));

        $manager->persist($testUser);
        $this->addReference("testUser", $testUser);

        for ($i = 0; $i < 50; $i++) {
            $user = new User();
            $user->setFirstname("FirstName-$i")
                ->setLastname("LastName-$i")
                ->setEmail("demoUser-$i@localhost.dev")
                ->setPassword($this->passwordEncoder->encodePassword($user, "demo1234"));

            $manager->persist($user);
            $this->addReference("user-$i", $user);
        }

        $manager->flush();
    }
}
