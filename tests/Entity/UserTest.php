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
            ->setPhone("00 00 00 00 00")
            ->setBusinessName("DemoCompany")
            ->setSiret("12345678912345")
            ->setTvaNumber("FR00123456789")
            ->setPassword("demo1234")
            ->setAddress("119 avenue Aléatoire")
            ->setCity("Paris")
            ->setPostalCode(75000)
            ->setCountry("FRA");
    }

    public function testPasswordConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setPassword("demo1234"));

        $this->assertHasErrors(2, $this->getEntity()->setPassword(""));
        $this->assertHasErrors(1, $this->getEntity()->setPassword("1"));
    }

    public function testConfirmationTokenConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setConfirmationToken(sha1(random_bytes(rand(8, 10)))));
        $this->assertHasErrors(0, $this->getEntity()->setConfirmationToken(null));

        $this->assertHasErrors(1, $this->getEntity()->setConfirmationToken("test"));
    }

    public function testFirstnameConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setFirstname("Test"));

        $this->assertHasErrors(1, $this->getEntity()->setFirstname(null));
        $this->assertHasErrors(2, $this->getEntity()->setFirstname(""));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testLastnameConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setLastname("Test"));

        $this->assertHasErrors(1, $this->getEntity()->setLastname(null));
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

    public function testBusinessNameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setBusinessName("DemoCompany"));
        $this->assertHasErrors(0, $this->getEntity()->setBusinessName(null));

        $this->assertHasErrors(1, $this->getEntity()->setBusinessName("abcdefghijklmnopqrstuvwxyz01234567891234567891"));
    }

    public function testSiretConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setSiret(12345678912345));
        $this->assertHasErrors(0, $this->getEntity()->setSiret(null));

        $this->assertHasErrors(1, $this->getEntity()->setSiret(12345));
        $this->assertHasErrors(1, $this->getEntity()->setSiret("invalid_siret"));
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
}
