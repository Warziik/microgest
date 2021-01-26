<?php

namespace App\Tests\Entity;

use App\Entity\Invoice;
use App\Tests\AssertTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Customer;
use DateTime;

class InvoiceTest extends ApiTestCase
{
    use FixturesTrait;
    use AssertTrait;

    /**
     * Return a valid Invoice Entity
     * 
     * @return Invoice
     */
    private function getEntity(): Invoice
    {
        return (new Invoice())
            ->setChrono(date("Y") . "-" . "9998")
            ->setAmount(rand(200, 5000))
            ->setStatus("NEW")
            ->setCustomer(new Customer())
            ->setPaidAt(null)
            ->setSentAt(null);
    }

    /**
     * Test get an Invoice
     */
    public function testGetInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/invoices/1", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        static::createClient()->request(Request::METHOD_GET, "/api/customers/1/invoices", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    /**
     * Test get an Invoice without being logged.
     */
    public function testGetInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, "/api/invoices/1");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        static::createClient()->request(Request::METHOD_GET, "/api/customers/1/invoices");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test get an Invoice that do not belongs to one of the User's Customers.
     */
    public function testGetUnownedInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/invoices/18", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);

        //static::createClient()->request(Request::METHOD_GET, "/api/customers/12/invoices", ["auth_bearer" => $authToken]);
        //$this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test get an unexisting Invoice.
     */
    public function testGetInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/invoices/999", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    /**
     * Test create an Invoice
     */
    public function testCreateInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $response = static::createClient()->request(Request::METHOD_POST, "/api/invoices", ["auth_bearer" => $authToken, "json" => [
            "chrono" => "2021-9999",
            "amount" => 2200,
            "status" => "SENT",
            "sentAt" => "2021-01-09 20:15:13",
            "customer" => "/api/customers/1"
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([
            "@context" => "/api/contexts/Invoice",
            "@type" => "Invoice",
            "amount" => 2200,
            "status" => "SENT"
        ]);
        $this->assertRegExp('~^/api/invoices/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Invoice::class);
    }

    /**
     * Test create an Invoice without being logged.
     */
    public function testCreateInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/invoices", ["json" => [
            "chrono" => "2021-9999",
            "amount" => 2200,
            "status" => "SENT",
            "sentAt" => "2021-01-09 20:15:13",
            "customer" => "/api/customers/1"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test create an invalid Invoice
     */
    public function testCreateInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()->request(Request::METHOD_POST, "/api/invoices", ["auth_bearer" => $authToken, "json" => [
            "amount" => 2200,
            "sentAt" => "2021-01-09",
            "customer" => "/api/customers/1"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    /**
     * Test update an Invoice
     */
    public function testUpdateInvoice(): void
    {
        $authToken = $this->getAuthToken();

        $response = static::createClient()->request(Request::METHOD_PUT, "/api/invoices/1", ["auth_bearer" => $authToken, "json" => [
            "amount" => 150,
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            "@context" => "/api/contexts/Invoice",
            "@type" => "Invoice",
            "amount" => 150
        ]);
        $this->assertRegExp('~^/api/invoices/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Invoice::class);
    }

    /**
     * Test update an Invoice without being logged.
     */
    public function testUpdateInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_PUT, "/api/invoices/1", ["json" => [
            "amound" => 150
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test update an Invoice that do not belongs to one of the User's Customers.
     */
    public function testUpdateUnownedInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/invoices/3", ["auth_bearer" => $authToken, "json" => [
            "amound" => 150
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test update an unexisting Invoice.
     */
    public function testUpdateInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/invoices/1", ["auth_bearer" => $authToken, "json" => [
            "amount" => "invalid_amount",
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    /**
     * Test delete an Invoice
     */
    public function testDeleteInvoice(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()->request(Request::METHOD_DELETE, "/api/invoices/1", ["auth_bearer" => $authToken]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
        $this->assertNull(static::$container->get('doctrine')->getRepository(Invoice::class)->find(1));
    }

    /**
     * Test delete an Invoice without being logged.
     */
    public function testDeleteInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_DELETE, "/api/invoices/1");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test delete an Invoice that do not belongs to one of the User's Customers.
     */
    public function testDeleteUnownedInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_DELETE, "/api/invoices/9", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test delete an unexisting invoice.
     */
    public function testDeleteInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_DELETE, "/api/invoices/99999", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    /**
     * Unit Tests: Properties constraints
     */
    public function testAmountConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setAmount(400.459));

        $this->assertHasErrors(1, $this->getEntity()->setAmount(null));
        $this->assertHasErrors(1, $this->getEntity()->setAmount("invalid_amount"));
    }

    public function testStatusConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setStatus("PAID"));

        $this->assertHasErrors(1, $this->getEntity()->setStatus(null));
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

    public function testCustomerConstraints(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setCustomer(null));
    }
}
