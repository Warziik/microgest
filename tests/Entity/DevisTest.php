<?php

namespace App\Tests\Entity;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Customer;
use App\Entity\Devis;
use App\Entity\Invoice;
use App\Tests\AssertTrait;
use DateTime;
use TypeError;

/**
 * Unit tests.
 */
class DevisTest extends ApiTestCase
{
    use AssertTrait;

    /**
     * Return a valid Invoice Entity.
     *
     * @return Invoice
     */
    private function getEntity(): Devis
    {
        return (new Devis())
            ->setChrono('D-2021-000001')
            ->setStatus('NEW')
            ->setValidityDate(new DateTime("+1 month"))
            ->setCreatedAt(new DateTime())
            ->setWorkStartDate(new DateTime('+2 weeks'))
            ->setWorkDuration("2 weeks")
            ->setPaymentDeadline(new DateTime('+2 months'))
            ->setPaymentDelayRate(3)
            ->setTvaApplicable(false)
            ->setIsDraft(false)
            ->setCustomer(new Customer());
    }

    public function testChronoConstraints(): void
    {
        $this->expectException(TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setChrono('D-2021-000000'));

        $this->assertHasErrors(1, $this->getEntity()->setChrono(null));
        $this->assertHasErrors(1, $this->getEntity()->setChrono(''));
        $this->assertHasErrors(1, $this->getEntity()->setChrono('invalid_chrono'));
    }

    public function testStatusConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setStatus('NEW'));
        $this->assertHasErrors(0, $this->getEntity()->setStatus('SENT'));
        $this->assertHasErrors(0, $this->getEntity()->setStatus('SIGNED'));
        $this->assertHasErrors(0, $this->getEntity()->setStatus('CANCELLED'));

        $this->assertHasErrors(1, $this->getEntity()->setStatus(null));
        $this->assertHasErrors(1, $this->getEntity()->setStatus('invalid_status'));
    }

    public function testValidityDateConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setValidityDate(new DateTime()));

        $this->assertHasErrors(1, $this->getEntity()->setValidityDate(null));
    }

    public function testWorkStartDateConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setWorkStartDate(new DateTime()));

        $this->assertHasErrors(1, $this->getEntity()->setWorkStartDate(null));
    }

    public function testWorkDurationConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setWorkDuration("1 week"));

        $this->assertHasErrors(1, $this->getEntity()->setWorkDuration(null));
    }

    public function testTvaApplicableConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setTvaApplicable(true));
        $this->assertHasErrors(0, $this->getEntity()->setTvaApplicable(false));

        $this->assertHasErrors(0, $this->getEntity()->setTvaApplicable(null));
    }

    public function testIsDraftConstraints(): void
    {
        $this->expectException(\TypeError::class);

        $this->assertHasErrors(0, $this->getEntity()->setIsDraft(true));
        $this->assertHasErrors(0, $this->getEntity()->setIsDraft(false));

        $this->assertHasErrors(0, $this->getEntity()->setIsDraft(null));
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
        $this->assertHasErrors(1, $this->getEntity()->setPaymentDelayRate('invalid_payment_delay_rate'));
    }

    public function testSignedAtConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setSignedAt(new DateTime()));
        $this->assertHasErrors(0, $this->getEntity()->setSignedAt(null));
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
