<?php

namespace App\Tests\Entity;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Customer;
use App\Entity\User;
use App\Tests\AssertTrait;

/**
 * Unit tests
 */
class CustomerTest extends ApiTestCase
{
    use AssertTrait;

    /**
     * Return a valid Customer Entity
     * 
     * @return Customer
     */
    private function getEntity(): Customer
    {
        return (new Customer)
            ->setFirstname("firstname")
            ->setLastname("lastname")
            ->setEmail("customer@localhost.dev")
            ->setOwner(new User());
    }

    public function testFirstnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setFirstname("Test"));

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

    public function testCompanyConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setCompany("DemoCompany"));
        $this->assertHasErrors(0, $this->getEntity()->setCompany(null));

        $this->assertHasErrors(1, $this->getEntity()->setCompany("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testOwnerConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setOwner(new User()));

        $this->assertHasErrors(1, $this->getEntity()->setOwner(null));
    }
}
