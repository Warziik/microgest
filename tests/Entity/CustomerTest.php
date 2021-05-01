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
            ->setType("PERSON")
            ->setFirstname("firstname")
            ->setLastname("lastname")
            ->setEmail("customer@localhost.dev")
            ->setAddress("avenue Aléatoire")
            ->setCity("Paris")
            ->setPostalCode(75000)
            ->setCountry("FRA")
            ->setOwner(new User());
    }

    public function testTypeConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setType("PERSON"));
        $this->assertHasErrors(0, $this->getEntity()->setType("COMPANY"));

        $this->assertHasErrors(1, $this->getEntity()->setType(null));
        $this->assertHasErrors(1, $this->getEntity()->setType("invalid_type"));
    }

    public function testFirstnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setFirstname("Test"));
        $this->assertHasErrors(0, $this->getEntity()->setFirstname(null));

        $this->assertHasErrors(2, $this->getEntity()->setFirstname(""));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testLastnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setLastname("Test"));
        $this->assertHasErrors(0, $this->getEntity()->setLastname(null));

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

    public function testPhoneConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setPhone("00 00 00 00 00"));
        $this->assertHasErrors(0, $this->getEntity()->setPhone(null));

        $this->assertHasErrors(1, $this->getEntity()->setPhone(""));
    }

    public function testCompanyConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setCompany("DemoCompany"));
        $this->assertHasErrors(0, $this->getEntity()->setCompany(null));

        $this->assertHasErrors(1, $this->getEntity()->setCompany("abcdefghijklmnopqrstuvwxyz01234567891234567891"));
    }

    public function testSiretConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setSiret("12345678912345"));
        $this->assertHasErrors(0, $this->getEntity()->setSiret(null));

        $this->assertHasErrors(1, $this->getEntity()->setSiret(12345));
    }

    public function testAddressConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setAddress("119 avenue Aléatoire"));

        $this->assertHasErrors(1, $this->getEntity()->setAddress(null));
        $this->assertHasErrors(1, $this->getEntity()->setAddress(""));
    }

    public function testCityConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setCity("Paris"));

        $this->assertHasErrors(1, $this->getEntity()->setAddress(null));
        $this->assertHasErrors(1, $this->getEntity()->setAddress(""));
    }

    public function testPostalCodeConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setPostalCode(75000));

        $this->assertHasErrors(1, $this->getEntity()->setPostalCode(null));
        $this->assertHasErrors(1, $this->getEntity()->setPostalCode("invalid_postalCode"));
    }

    public function testCountryConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setCountry("FRA"));

        $this->assertHasErrors(1, $this->getEntity()->setCountry(null));
        $this->assertHasErrors(1, $this->getEntity()->setCountry("invalid_country_code"));
    }

    public function testOwnerConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setOwner(new User()));

        $this->assertHasErrors(1, $this->getEntity()->setOwner(null));
    }
}
