<?php

namespace App\DataFixtures;

use App\Entity\JwtRefreshToken;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class JwtRefreshTokenFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $refreshJwtToken = new JwtRefreshToken();
        $refreshJwtToken->setRefreshToken('demoRefreshToken')
            ->setUsername('testUser@localhost.dev')
            ->setValid(new DateTime());

        $manager->persist($refreshJwtToken);
        $manager->flush();
    }
}
