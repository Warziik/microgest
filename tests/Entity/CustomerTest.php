<?php

namespace App\Tests\Entity;

use App\Entity\Customer;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use App\Tests\AssertTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerTest extends ApiTestCase
{
    use FixturesTrait;
    use AssertTrait;

    /**
     * Return a valid Customer Entity
     * 
     * @return Customer
     */
    private function getEntity(): Customer
    {
        return (new Customer)
            ->setFirstname("firstname")
            ->setLastname("lastname")
            ->setEmail("customer@localhost.dev")
            ->setOwner(new User());
    }

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

        //static::createClient()->request(Request::METHOD_GET, "/api/users/18/customers", ["auth_bearer" => $authToken]);
        //$this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
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
            "firstname" => "Firstname-test",
            "lastname" => "Lastname-test",
            "email" => "customer-test@localhost.dev",
            "company" => "",
            "owner" => "/api/users/1"
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([
            "@context" => "/api/contexts/Customer",
            "@type" => "Customer",
            "firstname" => "Firstname-test",
            "lastname" => "Lastname-test",
            "email" => "customer-test@localhost.dev"
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
            "firstname" => "Firstname-test",
            "lastname" => "Lastname-test",
            "email" => "customer-test@localhost.dev",
            "company" => "",
            "owner" => "/api/users/1"
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

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
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
     * Test update an unexisting Customer.
     */
    public function testUpdateInvalidCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/customers/1", ["auth_bearer" => $authToken, "json" => [
            "firstname" => null,
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

    /**
     * Unit Tests: Properties Constraints
     */
    public function testFirstnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setFirstname("Test"));

        $this->assertHasErrors(1, $this->getEntity()->setFirstname(""));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testLastnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setLastname("Test"));

        $this->assertHasErrors(1, $this->getEntity()->setLastname(""));
        $this->assertHasErrors(1, $this->getEntity()->setLastname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setLastname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testEmailConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setEmail("demo@localhost.dev"));

        $this->assertHasErrors(1, $this->getEntity()->setEmail(""));
        $this->assertHasErrors(1, $this->getEntity()->setEmail("invalid_email_format"));
    }

    public function testCompanyConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setCompany("DemoCompany"));
        $this->assertHasErrors(0, $this->getEntity()->setCompany(null));

        $this->assertHasErrors(1, $this->getEntity()->setCompany("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testOwnerConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setOwner(new User()));

        $this->assertHasErrors(1, $this->getEntity()->setOwner(null));
    }
}
