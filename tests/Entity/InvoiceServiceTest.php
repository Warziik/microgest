<?php

namespace App\Tests\Entity;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Invoice;
use App\Entity\InvoiceService;
use App\Tests\AssertTrait;

/**
 * Unit tests.
 */
class InvoiceServiceTest extends ApiTestCase
{
    use AssertTrait;

    /**
     * Return a valid Invoice Entity.
     *
     * @return Invoice
     */
    private function getEntity(): InvoiceService
    {
        return (new InvoiceService())
            ->setName("Création d'un site internet")
            ->setDescription('Application web sous Symfony 5 et ReactJS.')
            ->setQuantity(1)
            ->setUnitPrice(1632.15)
            ->setInvoice(new Invoice());
    }

    public function testNameConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setName("Création d'une application mobile."));

        $this->assertHasErrors(1, $this->getEntity()->setName(null));
        $this->assertHasErrors(1, $this->getEntity()->setName(''));
        // Too long
        $this->assertHasErrors(
            1,
            $this->getEntity()->setName('1234567891234567891231234567891234567891023456789012345678912')
        );
    }

    public function testDescriptionConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setDescription('Application mobile développée avec Flutter.'));
        $this->assertHasErrors(0, $this->getEntity()->setDescription(null));

        $this->assertHasErrors(1, $this->getEntity()->setDescription(''));
    }

    public function testQuantityConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setQuantity(1));
        $this->assertHasErrors(0, $this->getEntity()->setQuantity(null));

        $this->assertHasErrors(1, $this->getEntity()->setQuantity('invalid_quantity'));
    }

    public function testUnitPriceConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setUnitPrice(1549.51));

        $this->assertHasErrors(1, $this->getEntity()->setUnitPrice(null));
    }
}
