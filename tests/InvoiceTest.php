<?php

namespace App\Tests;

use App\Entity\Invoice;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;

/**
 * Functional tests
 */
class InvoiceTest extends ApiTestCase
{
    use FixturesTrait;
    use AssertTrait;

    /**
     * Test get all Invoices of the logged User.
     */
    public function testGetAllInvoices(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/invoices", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            "@id" => "/api/invoices"
        ]);
    }

    /**
     * Test get all Invoices without being logged.
     */
    public function testGetAllInvoicseWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, "/api/invoices");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test get an Invoice.
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

        static::createClient()->request(Request::METHOD_GET, "/api/customers/12/invoices", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
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
            "amount" => 2200,
            "status" => "SENT",
            "service" => "Website creation",
            "sentAt" => "2021-01-09 20:15:13",
            "customer" => "/api/customers/1"
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([
            "@context" => "/api/contexts/Invoice",
            "@type" => "Invoice",
            "amount" => 2200,
            "status" => "SENT",
            "service" => "Website creation"
        ]);
        $this->assertRegExp('~^/api/invoices/\d+$~', $response->toArray()['@id']);
    }

    /**
     * Test create an Invoice without being logged.
     */
    public function testCreateInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/invoices", ["json" => [
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
            "amount" => 2200
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $this->assertJsonEquals([
            "code" => Response::HTTP_UNPROCESSABLE_ENTITY,
            "message" => "A customer must be provided."
        ]);
    }

    /**
     * Test create an Invoice for a Customer that the User don't own
     */
    public function testCreateInvoiceForCustomerYouDontOwn(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()->request(Request::METHOD_POST, "/api/invoices", ["auth_bearer" => $authToken, "json" => [
            "amount" => 2200,
            "status" => "SENT",
            "customer" => "/api/customers/18"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJsonContains([
            "code" => Response::HTTP_UNAUTHORIZED,
            "message" => "You cannot set an invoice for a customer you don't own."
        ]);
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
}
