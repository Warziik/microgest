<?php

namespace App\Tests\Entity;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Invoice;
use App\Tests\AssertTrait;
use App\Entity\Customer;
use DateTime;
use TypeError;

/**
 * Unit tests
 */
class InvoiceTest extends ApiTestCase
{
    use AssertTrait;

    /**
     * Return a valid Invoice Entity
     * 
     * @return Invoice
     */
    private function getEntity(): Invoice
    {
        return (new Invoice())
            ->setAmount(rand(200, 5000))
            ->setStatus("NEW")
            ->setCustomer(new Customer());
    }

    public function testAmountConstraints(): void
    {
        $this->expectException(\TypeError::class);
        $this->assertHasErrors(0, $this->getEntity()->setAmount(400.459));

        $this->assertHasErrors(1, $this->getEntity()->setAmount(null));
        $this->assertHasErrors(1, $this->getEntity()->setAmount("invalid_amount"));
    }

    public function testStatusConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setStatus("PAID"));

        $this->assertHasErrors(1, $this->getEntity()->setStatus("invalid_status"));
    }

    public function testPaidAtConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setPaidAt(new DateTime()));
        $this->assertHasErrors(0, $this->getEntity()->setPaidAt(null));
    }

    public function testSentAtConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setSentAt(new DateTime()));
        $this->assertHasErrors(0, $this->getEntity()->setSentAt(null));
    }

    public function testChronoConstraints(): void
    {
        $this->expectException(TypeError::class);
        $this->assertHasErrors(0, $this->getEntity()->setChrono("2021-0000"));

        $this->assertHasErrors(1, $this->getEntity()->setChrono(null));
        $this->assertHasErrors(1, $this->getEntity()->setChrono(""));
        $this->assertHasErrors(1, $this->getEntity()->setChrono("invalid_chrono"));
    }

    public function testCustomerConstraints(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setCustomer(null));
    }
}
