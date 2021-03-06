<?php

namespace App\DataFixtures;

use App\Entity\ResetPassword;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ResetPasswordFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $testResetPassword = (new ResetPassword())->setUser($this->getReference("testUser"));
        $manager->persist($testResetPassword);

        for ($i = 0; $i < 50; $i++) {
            $resetPassword = (new ResetPassword())->setUser($this->getReference("user-" . rand(1, 50)));
            $manager->persist($resetPassword);
        }
        $manager->flush();
    }

    public function getDependencies()
    {
        return [UserFixtures::class];
    }
}
