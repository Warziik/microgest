<?php

namespace App\Tests;

use App\DataFixtures\UserFixtures;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

// TODO: Write documentation for each test.
class AuthTest extends ApiTestCase
{
    use FixturesTrait;

    public function testLogin(): void
    {
        $this->loadFixtures([UserFixtures::class]);

        static::createClient()->request(Request::METHOD_POST, "/api/authentication_token", ["json" => [
            "username" => "demoUser-0@localhost.dev",
            "password" => "demo1234",
        ]]);
        $this->assertResponseIsSuccessful();
    }

    public function testInvalidLogin(): void
    {
        $this->loadFixtures([UserFixtures::class]);

        static::createClient()->request(Request::METHOD_POST, "/api/authentication_token", ["json" => [
            "username" => "invalidUser",
            "password" => "demo1234",
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertResponseHeaderSame('content-type', 'application/json');
        $this->assertJsonContains([
            'code' => Response::HTTP_UNAUTHORIZED,
            'message' => 'Invalid credentials.'
        ]);
    }

    public function testRegister(): void
    {
        $this->loadFixtures([UserFixtures::class]);

        $response = static::createClient()->request(Request::METHOD_POST, "/api/users", ["json" => [
            "firstname" => "demoUser-firstname",
            "lastname" => "demoUser-lastname",
            "email" => "demo@domain.fr",
            "password" => "demo1234"
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@type' => 'User',
            'firstname' => 'demoUser-firstname',
            'lastname' => 'demoUser-lastname',
            'email' => 'demo@domain.fr',
            'roles' => ["ROLE_USER"],
        ]);

        $this->assertRegExp('~^/api/users/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    public function testInvalidRegister(): void
    {
        $this->loadFixtures([UserFixtures::class]);

        static::createClient()->request(Request::METHOD_POST, "/api/users", ["json" => [
            "email" => ""
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
