<?php

namespace App\Tests;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\CustomerFixtures;
use App\DataFixtures\DevisFixtures;
use App\Entity\Devis;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Functional tests.
 */
class DevisTest extends ApiTestCase
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
     * Test get all Devis of the logged User.
     */
    public function testGetAllDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([DevisFixtures::class]);

        static::createClient()->request(Request::METHOD_GET, '/api/devis', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@id' => '/api/devis',
        ]);
    }

    /**
     * Test get all Devis without being logged.
     */
    public function testGetAllDevisWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, '/api/devis');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test get a Devis.
     */
    public function testGetDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class, DevisFixtures::class]);

        static::createClient()->request(Request::METHOD_GET, '/api/devis/1', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        static::createClient()
            ->request(Request::METHOD_GET, '/api/customers/1/devis', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    /**
     * Test get a Devis without being logged.
     */
    public function testGetDevisWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, '/api/devis/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        static::createClient()->request(Request::METHOD_GET, '/api/customers/1/devis');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test get a Devis that do not belongs to one of the User's Customers.
     */
    public function testGetUnownedInvoice(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class, DevisFixtures::class]);

        static::createClient()->request(Request::METHOD_GET, '/api/devis/18', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);

        static::createClient()
            ->request(Request::METHOD_GET, '/api/customers/12/devis', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test get an unexisting Devis.
     */
    public function testGetInvalidDevis(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, '/api/devis/999', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    /**
     * Test create a Devis.
     */
    public function testCreateDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class]);

        $response = static::createClient()
            ->request(Request::METHOD_POST, '/api/devis', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'NEW',
                'validityDate' => '2021-04-18',
                'workStartDate' => '2021-04-18',
                'workDuration' => '1 week',
                'paymentDeadline' => '2021-04-18',
                'paymentDelayRate' => null,
                'tvaApplicable' => false,
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
            '@context' => '/api/contexts/Devis',
            '@type' => 'Devis',
            'status' => 'NEW',
            'sentAt' => null,
            'signedAt' => null,
            'workDuration' => '1 week',
            'paymentDelayRate' => null,
            'tvaApplicable' => false,
            'isDraft' => false,
            'customer' => [
                '@id' => '/api/customers/1',
                '@type' => 'Customer'
            ],
            'services' => [
                [
                    'name' => "Création d'un site internet",
                    'description' => null,
                    'quantity' => 1,
                    'unitPrice' => 2051.51,
                ],
            ],
        ]);
        $this->assertMatchesRegularExpression('~^/api/devis/\d+$~', $response->toArray()['@id']);
    }

    /**
     * Test create a Devis without being logged.
     */
    public function testCreateDevisWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_POST, '/api/invoices', ['json' => [
            'status' => 'NEW',
            'validityDate' => '2021-04-18',
            'workStartDate' => '2021-04-18',
            'workDuration' => '1 week',
            'paymentDeadline' => '2021-04-18',
            'paymentDelayRate' => null,
            'tvaApplicable' => false,
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

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test create an invalid Devis.
     */
    public function testCreateInvalidDevis(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()
            ->request(Request::METHOD_POST, '/api/devis', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'NEW',
            ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains(
            ["hydra:description" => "Un client doit être passé comme paramètre dans le requête POST."]
        );
    }

    /**
     * Test create a Devis for a Customer that the User don't own.
     */
    public function testCreateDevisForCustomerYouDontOwn(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([CustomerFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_POST, '/api/devis', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'NEW',
                'validityDate' => '2021-04-18',
                'workStartDate' => '2021-04-18',
                'workDuration' => '1 week',
                'paymentDeadline' => '2021-04-18',
                'paymentDelayRate' => null,
                'tvaApplicable' => false,
                'isDraft' => false,
                'customer' => '/api/customers/18',
                'services' => [
                    [
                        'name' => "Création d'un site internet",
                        'description' => null,
                        'quantity' => 1,
                        'unitPrice' => 2051.51,
                    ],
                ],
            ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
        $this->assertJsonContains(
            ["hydra:description" => "Vous ne pouvez pas assigner une facture à un client que vous ne possédez pas."]
        );
    }

    /**
     * Test update a Devis.
     */
    public function testUpdateDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([DevisFixtures::class]);

        $response = static::createClient()
            ->request(Request::METHOD_PUT, '/api/devis/1', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'SIGNED',
                'paidAt' => '2021-05-10 13:16:04',
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@context' => '/api/contexts/Devis',
            '@type' => 'Devis',
            'status' => 'SIGNED',
        ]);
        $this->assertMatchesRegularExpression('~^/api/devis/\d+$~', $response->toArray()['@id']);
    }

    /**
     * Test update a Devis without being logged.
     */
    public function testUpdateDevisWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_PUT, '/api/devis/1', ['json' => [
            'status' => 'SIGNED',
            'signedAt' => '2021-05-10 13:16:04',
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test update a Devis that do not belongs to one of the User's Customers.
     */
    public function testUpdateUnownedDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([DevisFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_PUT, '/api/devis/3', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'SIGNED',
                'signedAt' => '2021-05-10 13:16:04',
            ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test update an unexisting Devis.
     */
    public function testUpdateInvalidDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([DevisFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_PUT, '/api/devis/1', ['auth_bearer' => $authToken, 'json' => [
                'status' => 'invalid_status',
            ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Test delete a Devis.
     */
    public function testDeletDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([DevisFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/devis/1', ['auth_bearer' => $authToken]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
        $this->assertNull(static::getContainer()->get('doctrine')->getRepository(Devis::class)->find(1));
    }

    /**
     * Test delete a Devis without being logged.
     */
    public function testDeleteDevisWithoutAuthorization(): void
    {
        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/devis/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test delete a Devis that do not belongs to one of the User's Customers.
     */
    public function testDeleteUnownedDevis(): void
    {
        $authToken = $this->getAuthToken();
        $this->databaseTool->loadFixtures([DevisFixtures::class]);

        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/devis/9', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test delete an unexisting Devis.
     */
    public function testDeleteInvalidDevis(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()
            ->request(Request::METHOD_DELETE, '/api/devis/99999', ['auth_bearer' => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
