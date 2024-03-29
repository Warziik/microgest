<?php

namespace App\Tests;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\CustomerFixtures;
use App\DataFixtures\InvoiceFixtures;
use App\Entity\Invoice;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Functional tests.
 */
class InvoiceTest extends ApiTestCase
{
    use AssertTrait;

    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    protected function setUp(): void
    {
        parent::setUp();

        static::bootKernel();
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    /**
     * Test get all Invoices of the logged User.
     */
    public function testGetAllInvoices(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([InvoiceFixtures::class]);

        static::createClient()->request(Request::METHOD_GET, '/api/invoices', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@id' => '/api/invoices',
        ]);
    }

    /**
     * Test get all Invoices without being logged.
     */
    public function testGetAllInvoicseWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, '/api/invoices');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test get an Invoice.
     */
    public function testGetInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class, InvoiceFixtures::class]);

        static::createClient()->request(Request::METHOD_GET, '/api/invoices/1', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        static::createClient()
            ->request(Request::METHOD_GET, '/api/customers/1/invoices', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    /**
     * Test get an Invoice without being logged.
     */
    public function testGetInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, '/api/invoices/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        static::createClient()->request(Request::METHOD_GET, '/api/customers/1/invoices');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test get an Invoice that do not belongs to one of the User's Customers.
     */
    public function testGetUnownedInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class, InvoiceFixtures::class]);

        static::createClient()->request(Request::METHOD_GET, '/api/invoices/18', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);

        static::createClient()
            ->request(Request::METHOD_GET, '/api/customers/12/invoices', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test get an unexisting Invoice.
     */
    public function testGetInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, '/api/invoices/999', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    /**
     * Test create an Invoice.
     */
    public function testCreateInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class]);

        $response = static::createClient()
            ->request(Request::METHOD_POST, '/api/invoices', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'SENT',
                'sentAt' => '2021-04-09 20:15:13',
                'tvaApplicable' => false,
                'serviceDoneAt' => '2021-03-18',
                'paymentDeadline' => '2021-04-18',
                'paymentDelayRate' => null,
                'isDraft' => false,
                'customer' => '/api/customers/1',
                'services' => [
                    [
                        'name' => "Création d'un site internet",
                        'description' => null,
                        'quantity' => 1,
                        'unitPrice' => 2051.51,
                    ],
                ],
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([
            '@context' => '/api/contexts/Invoice',
            '@type' => 'Invoice',
            'status' => 'SENT',
            'tvaApplicable' => false,
            'paymentDelayRate' => null,
            'isDraft' => false,
            'paidAt' => null,
            'services' => [
                [
                    'name' => "Création d'un site internet",
                    'description' => null,
                    'quantity' => 1,
                    'unitPrice' => 2051.51,
                ],
            ],
        ]);
        $this->assertMatchesRegularExpression('~^/api/invoices/\d+$~', $response->toArray()['@id']);
    }

    /**
     * Test create an Invoice without being logged.
     */
    public function testCreateInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_POST, '/api/invoices', ['json' => [
            'status' => 'SENT',
            'sentAt' => '2021-04-09 20:15:13',
            'tvaApplicable' => false,
            'isDraft' => false,
            'serviceDoneAt' => '2021-03-18',
            'paymentDeadline' => '2021-04-18',
            'paymentDelayRate' => null,
            'customer' => '/api/customers/1',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test create an invalid Invoice.
     */
    public function testCreateInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()
            ->request(Request::METHOD_POST, '/api/invoices', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'NEW',
            ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains(
            ["hydra:description" => "Un client doit être passé comme paramètre dans le requête POST."]
        );
    }

    /**
     * Test create an Invoice for a Customer that the User don't own.
     */
    public function testCreateInvoiceForCustomerYouDontOwn(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_POST, '/api/invoices', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'SENT',
                'sentAt' => '2021-04-09 20:15:13',
                'tvaApplicable' => false,
                'isDraft' => false,
                'serviceDoneAt' => '2021-03-18',
                'paymentDeadline' => '2021-04-18',
                'paymentDelayRate' => null,
                'customer' => '/api/customers/18',
            ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
        $this->assertJsonContains(
            ["hydra:description" => "Vous ne pouvez pas assigner une facture à un client que vous ne possédez pas."]
        );
    }

    /**
     * Test update an Invoice.
     */
    public function testUpdateInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([InvoiceFixtures::class]);

        $response = static::createClient()
            ->request(Request::METHOD_PUT, '/api/invoices/1', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'PAID',
                'paidAt' => '2021-05-10 13:16:04',
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@context' => '/api/contexts/Invoice',
            '@type' => 'Invoice',
            'status' => 'PAID',
        ]);
        $this->assertMatchesRegularExpression('~^/api/invoices/\d+$~', $response->toArray()['@id']);
    }

    /**
     * Test update an Invoice without being logged.
     */
    public function testUpdateInvoiceWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_PUT, '/api/invoices/1', ['json' => [
            'status' => 'PAID',
            'paidAt' => '2021-05-10 13:16:04',
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test update an Invoice that do not belongs to one of the User's Customers.
     */
    public function testUpdateUnownedInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([InvoiceFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_PUT, '/api/invoices/3', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'PAID',
                'paidAt' => '2021-05-10 13:16:04',
            ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test update an unexisting Invoice.
     */
    public function testUpdateInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([InvoiceFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_PUT, '/api/invoices/1', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'invalid_status',
            ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Test delete an Invoice.
     */
    public function testDeleteInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([InvoiceFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/invoices/1', ['auth_bearer' => $authToken]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
        $this->assertNull(static::getContainer()->get('doctrine')->getRepository(Invoice::class)->find(1));
    }

    /**
     * Test delete an Invoice without being logged.
     */
    public function testDeleteInvoiceWithoutAuthorization(): void
    {
        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/invoices/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test delete an Invoice that do not belongs to one of the User's Customers.
     */
    public function testDeleteUnownedInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([InvoiceFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/invoices/9', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test delete an unexisting invoice.
     */
    public function testDeleteInvalidInvoice(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/invoices/99999', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
