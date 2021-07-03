<?php

namespace App\DataFixtures;

use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken;

class JwtRefreshTokenFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $refreshJwtToken = new RefreshToken();
        $refreshJwtToken->setRefreshToken('demoRefreshToken')
            ->setUsername('testUser@localhost.dev')
            ->setValid(new DateTime());

        $manager->persist($refreshJwtToken);
        $manager->flush();
    }
}
