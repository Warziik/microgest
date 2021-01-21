<?php

namespace App\Tests\Entity;

use App\Entity\Customer;
use App\DataFixtures\UserFixtures;
use App\DataFixtures\CustomerFixtures;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerTest extends ApiTestCase
{
    use FixturesTrait;

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
            ->setEmail("customer@localhost.dev");
    }

    /**
     * Test the validation constraints of an entity
     * 
     * @param int $nbErrorExpected Number of errors expected due to the validation constraints
     * @param Customer $entity Entity to test the validation constraints
     */
    private function assertHasErrors(int $nbErrorExpected, Customer $entity): void
    {
        self::bootKernel();
        $validator = self::$container->get('validator');
        $errors = $validator->validate($entity);
        $messages = [];

        foreach ($errors as $e) {
            $messages[] = $e->getPropertyPath() . " => " . $e->getMessage();
        }

        $this->assertCount($nbErrorExpected, $errors, implode(", ", $messages));
    }

    /**
     * Retrieve an authorization JWT Token to make API call
     * 
     * @return string JWT Token
     */
    private function getAuthToken(): string
    {
        $this->loadFixtures([UserFixtures::class, CustomerFixtures::class]);

        $response = static::createClient()->request(Request::METHOD_POST, "/api/authentication_token", ["json" => [
            "username" => "testUser@localhost.dev",
            "password" => "demo1234",
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        return $response->toArray()["token"];
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
     * Create a valid customer with a JWT Token
     */
    public function testCreateCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_POST, "/api/customers", ["auth_bearer" => $authToken, "json" => [
            "firstname" => "Firstname-test",
            "lastname" => "Lastname-test",
            "email" => "customer-test@localhost.dev",
            "company" => "",
            "owner" => "/api/users/1"
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([]);
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
     * Update a Customer of the logged User
     */
    public function testUpdateCustomer(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/customers/1", ["auth_bearer" => $authToken, "json" => [
            "company" => "testCustomerCompany",
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([]);
    }

    /**
     * Update a Customer without being logged
     */
    public function testUpdateCustomerWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_PUT, "/api/customers/1", ["json" => [
            "company" => "testCustomerCompany",
        ]]);

        $this->assertResponseStatusCodeSame(401);
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

    // TODO: Extract the methods below in a separate file
    public function testFirstnameTooShort(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("f"));
    }

    public function testInvalidBlankFirstname(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setFirstname(""));
    }

    public function testLastnameTooShort(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setLastname("f"));
    }

    public function testInvalidBlankLastname(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setLastname(""));
    }

    public function testInvalidEmail(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setEmail("invalid_email_format"));
    }

    public function testInvalidBlankEmail(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setEmail(""));
    }
}
