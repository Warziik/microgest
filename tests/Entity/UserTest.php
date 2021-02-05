<?php

namespace App\Tests\Entity;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use App\Tests\AssertTrait;

/**
 * Unit tests
 */
class UserTest extends ApiTestCase
{
    use AssertTrait;

    /**
     * Return a valid User Entity
     * 
     * @return User
     */
    private function getEntity(): User
    {
        return (new User())
            ->setFirstname("Firstname")
            ->setLastname("LastName")
            ->setEmail("demo@localhost.dev")
            ->setPassword("demo1234");
    }

    public function testFirstnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setFirstname("Alex"));

        $this->assertHasErrors(2, $this->getEntity()->setFirstname(""));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testLastnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setLastname("Test"));

        $this->assertHasErrors(2, $this->getEntity()->setLastname(""));
        $this->assertHasErrors(1, $this->getEntity()->setLastname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setLastname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testEmailConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setEmail("demo@localhost.dev"));

        $this->assertHasErrors(1, $this->getEntity()->setEmail(""));
        $this->assertHasErrors(1, $this->getEntity()->setEmail("invalid_email_format"));
    }

    public function testPasswordConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setPassword("demo1234"));

        $this->assertHasErrors(1, $this->getEntity()->setPassword(""));
        $this->assertHasErrors(1, $this->getEntity()->setPassword("1"));
    }
}
