<?php

namespace App\Tests\Entity;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\ResetPassword;
use App\Entity\User;
use App\Tests\AssertTrait;

class ResetPasswordTest extends ApiTestCase
{
    use AssertTrait;

    private function getEntity(): ResetPassword
    {
        return (new ResetPassword())
            ->setUser(new User())
            ->setToken("testToken0123456789");
    }

    public function testTokenConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setToken(sha1(random_bytes(10))));

        $this->assertHasErrors(1, $this->getEntity()->setToken("test"));
        $this->assertHasErrors(1, $this->getEntity()->setToken(""));
    }
}
