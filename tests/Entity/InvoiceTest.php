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
            ->setChrono("2021-000001")
            ->setStatus("NEW")
            ->setTvaApplicable(false)
            ->setServiceDoneAt(new DateTime("-1 week"))
            ->setPaymentDeadline(new DateTime("+40 days"))
            ->setPaymentDelayRate(3)
            ->setCreatedAt(new DateTime())
            ->setCustomer(new Customer());
    }

    public function testChronoConstraints(): void
    {
        $this->expectException(TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setChrono("2021-000000"));

        $this->assertHasErrors(1, $this->getEntity()->setChrono(null));
        $this->assertHasErrors(1, $this->getEntity()->setChrono(""));
        $this->assertHasErrors(1, $this->getEntity()->setChrono("invalid_chrono"));
    }

    public function testStatusConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setStatus("PAID"));

        $this->assertHasErrors(0, $this->getEntity()->setStatus("NEW"));
        $this->assertHasErrors(0, $this->getEntity()->setStatus("SENT"));
        $this->assertHasErrors(0, $this->getEntity()->setStatus("PAID"));
        $this->assertHasErrors(0, $this->getEntity()->setStatus("CANCELLED"));

        $this->assertHasErrors(1, $this->getEntity()->setStatus(null));
        $this->assertHasErrors(1, $this->getEntity()->setStatus("invalid_status"));
    }

    public function testTvaApplicableConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setTvaApplicable(true));
        $this->assertHasErrors(0, $this->getEntity()->setTvaApplicable(false));

        $this->assertHasErrors(0, $this->getEntity()->setTvaApplicable(null));
    }

    public function testServiceDoneAtConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setServiceDoneAt(new DateTime()));

        $this->assertHasErrors(1, $this->getEntity()->setServiceDoneAt(null));
    }

    public function testPaymentDeadlineConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setPaymentDeadline(new DateTime()));

        $this->assertHasErrors(1, $this->getEntity()->setPaymentDeadline(null));
    }

    public function testPaymentDelayRateConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setPaymentDelayRate(20));
        $this->assertHasErrors(0, $this->getEntity()->setPaymentDelayRate(null));

        $this->assertHasErrors(1, $this->getEntity()->setPaymentDelayRate(400)); // Out of Range (max 100)
        $this->assertHasErrors(1, $this->getEntity()->setPaymentDelayRate("invalid_payment_delay_rate"));
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

    public function testCustomerConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setCustomer(new Customer()));

        $this->assertHasErrors(1, $this->getEntity()->setCustomer(null));
    }
}
