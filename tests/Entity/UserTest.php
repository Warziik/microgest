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
            ->setEmail("valid@email.fr")
            ->setPassword("demo1234");
    }

    /**
     * Update another User than the one logged in
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
     * Update a User
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
     * Update a User without being logged
     */
    public function testUpdateUserWithoutAuthorization(): void
    {
        static::createClient()->request(Request::METHOD_PUT, "/api/users/1", ["json" => [
            "firstname" => "NewFirstname"
        ]]);

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

    public function testPasswordTooShort(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setPassword("1"));
    }

    public function testInvalidBlankPassword(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setPassword(""));
    }
}
