<?php

namespace App\Tests;

use App\Entity\Customer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;

/**
 * Functional tests
 */
class CustomerTest extends ApiTestCase
{
    use FixturesTrait;
    use AssertTrait;

    /**
     * Test get Customer
     */
    public function testGetCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/customers/1", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        static::createClient()->request(Request::METHOD_GET, "/api/users/1/customers", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    /**
     * Test get Customer without being logged.
     */
    public function testGetCustomerWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, "/api/customers/1");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        static::createClient()->request(Request::METHOD_GET, "/api/users/1/customers");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that a User cannot retrieve the Customers data of another User
     */
    public function testGetUnownedCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/customers/3", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);

        static::createClient()->request(Request::METHOD_GET, "/api/users/18/customers", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test get an unexisting Customer.
     */
    public function testGetInvalidCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/customers/999", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    /**
     * Create a valid customer with a JWT Token
     */
    public function testCreateCustomer(): void
    {
        $authToken = $this->getAuthToken();

        $response = static::createClient()->request(Request::METHOD_POST, "/api/customers", ["auth_bearer" => $authToken, "json" => [
            "type" => "PERSON",
            "firstname" => "Firstname-test",
            "lastname" => "Lastname-test",
            "email" => "customer-test@localhost.dev",
            "address" => "119 avenue Aléatoire",
            "city" => "Paris",
            "postalCode" => 75000,
            "country" => "FRA"
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([
            "@context" => "/api/contexts/Customer",
            "@type" => "Customer",
            "type" => "PERSON",
            "firstname" => "Firstname-test",
            "lastname" => "Lastname-test",
            "email" => "customer-test@localhost.dev",
            "address" => "119 avenue Aléatoire",
            "city" => "Paris",
            "postalCode" => 75000,
            "country" => "FRA"
        ]);
        $this->assertRegExp('~^/api/customers/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Customer::class);
    }

    /**
     * Create a valid Customer without being logged
     */
    public function testCreateCustomerWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/customers", ["json" => [
            "type" => "PERSON",
            "firstname" => "Firstname-test",
            "lastname" => "Lastname-test",
            "email" => "customer-test@localhost.dev",
            "address" => "119 avenue Aléatoire",
            "city" => "Paris",
            "postalCode" => 75000,
            "country" => "FRA"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test create an invalid Customer
     */
    public function testCreateInvalidCustomer(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()->request(Request::METHOD_POST, "/api/customers", ["auth_bearer" => $authToken, "json" => [
            "firstname" => "Test"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Update a Customer of the logged User
     */
    public function testUpdateCustomer(): void
    {
        $authToken = $this->getAuthToken();

        $response = static::createClient()->request(Request::METHOD_PUT, "/api/customers/1", ["auth_bearer" => $authToken, "json" => [
            "company" => "testCustomerCompany",
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            "@context" => "/api/contexts/Customer",
            "@type" => "Customer",
            "company" => "testCustomerCompany"
        ]);
        $this->assertRegExp('~^/api/customers/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Customer::class);
    }

    /**
     * Update a Customer without being logged
     */
    public function testUpdateCustomerWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_PUT, "/api/customers/1", ["json" => [
            "company" => "testCustomerCompany",
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Update a Customer that dosnt belongs to the logged User
     */
    public function testUpdateUnownedCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/customers/3", ["auth_bearer" => $authToken, "json" => [
            "owner" => "/api/users/9"
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test update a Customer with an invalid request.
     */
    public function testUpdateInvalidCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/customers/1", ["auth_bearer" => $authToken, "json" => [
            "firstname" => 123,
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    /**
     * Delete a Customer of the logged User
     */
    public function testDeleteCustomer(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()->request(Request::METHOD_DELETE, "/api/customers/1", ["auth_bearer" => $authToken]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
        $this->assertNull(static::$container->get('doctrine')->getRepository(Customer::class)->findOneBy(['email' => 'testCustomer@localhost.dev']));
    }

    /**
     * Delete a Customer without being logged
     */
    public function testDeleteCustomerWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_DELETE, "/api/customers/1");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Delete a Customer that dosnt belongs to the logged User
     */
    public function testDeleteUnownedCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_DELETE, "/api/customers/9", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test delete an unexisting Customer.
     */
    public function testDeleteInvalidCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_DELETE, "/api/customers/99999", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
