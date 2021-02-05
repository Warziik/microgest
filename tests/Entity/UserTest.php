<?php

namespace App\Tests\Entity;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use App\Tests\AssertTrait;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserTest extends ApiTestCase
{
    use FixturesTrait;
    use AssertTrait;

    /**
     * Return a valid User Entity
     * 
     * @return User
     */
    private function getEntity(): User
    {
        return (new User())
            ->setFirstname("Firstname")
            ->setLastname("LastName")
            ->setEmail("demo@localhost.dev")
            ->setPassword("demo1234");
    }

    /**
     * Test get User
     */
    public function testGetUser(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/users/1", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    /**
     * Test get User without being logged.
     */
    public function testGetUserWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_GET, "/api/users/1");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that a User cannot retrive the data of another User.
     */
    public function testGetAnotherUser(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/users/3", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test get an unexisting User.
     */
    public function testGetInvalidUser(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_GET, "/api/users/999", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    /**
     * Update a User.
     */
    public function testUpdateUser(): void
    {
        $authToken = $this->getAuthToken();

        $response = static::createClient()->request(Request::METHOD_PUT, "/api/users/1", ["auth_bearer" => $authToken, "json" => [
            "firstname" => "NewFirstname"
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            "@context" => "/api/contexts/User",
            "@type" => "User",
            "firstname" => "NewFirstname"
        ]);
        $this->assertRegExp('~^/api/users/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    /**
     * Update a User without being logged.
     */
    public function testUpdateUserWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_PUT, "/api/users/1", ["json" => [
            "firstname" => "NewFirstname"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Update another User than the one logged in.
     */
    public function testUpdateAnotherUser(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/users/7", ["auth_bearer" => $authToken, "json" => [
            "email" => "another_user_email@localhost.dev"
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test update a User with an invalid request.
     */
    public function testUpdateInvalidUser(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_PUT, "/api/users/1", ["auth_bearer" => $authToken, "json" => [
            "firstname" => null,
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    /**
     * Delete a User
     */
    public function testDeleteUser(): void
    {
        $authToken = $this->getAuthToken();
        static::createClient()->request(Request::METHOD_DELETE, "/api/users/1", ["auth_bearer" => $authToken]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
        $this->assertNull(static::$container->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'testUser@localhost.dev']));
    }

    /**
     * Delete a User without being logged
     */
    public function testDeleteUserWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_DELETE, "/api/users/1");
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Delete another User than the one logged in
     */
    public function testDeleteAnotherUser(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_DELETE, "/api/users/8", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test delete an unexisting User
     */
    public function testDeleteInvalidUser(): void
    {
        $authToken = $this->getAuthToken();

        static::createClient()->request(Request::METHOD_DELETE, "/api/users/99999", ["auth_bearer" => $authToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    /**
     * Unit Tests: Properties Constraints
     */
    public function testFirstnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setFirstname("Alex"));

        $this->assertHasErrors(2, $this->getEntity()->setFirstname(""));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testLastnameConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setLastname("Test"));

        $this->assertHasErrors(2, $this->getEntity()->setLastname(""));
        $this->assertHasErrors(1, $this->getEntity()->setLastname("f"));
        $this->assertHasErrors(1, $this->getEntity()->setLastname("abcdefghijklmnopqrstuvwxyz0123456789"));
    }

    public function testEmailConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setEmail("demo@localhost.dev"));

        $this->assertHasErrors(1, $this->getEntity()->setEmail(""));
        $this->assertHasErrors(1, $this->getEntity()->setEmail("invalid_email_format"));
    }

    public function testPasswordConstraints(): void
    {
        $this->assertHasErrors(0, $this->getEntity()->setPassword("demo1234"));

        $this->assertHasErrors(1, $this->getEntity()->setPassword(""));
        $this->assertHasErrors(1, $this->getEntity()->setPassword("1"));
    }
}
