<?php

namespace App\Tests;

use App\DataFixtures\UserFixtures;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthTest extends ApiTestCase
{
    use FixturesTrait;

    protected function setUp(): void
    {
        parent::setUp();
        $this->loadFixtures([UserFixtures::class]);
    }

    public function testLogin(): void
    {
        $client = static::createClient();
        $client->request(Request::METHOD_POST, "/api/authentication_token", ["json" => [
            "email" => "testUser@localhost.dev",
            "password" => "demo1234",
        ]]);
        $this->assertResponseIsSuccessful();
        $this->assertInstanceOf(Cookie::class, $client->getCookieJar()->get("__refresh__token"));
    }

    public function testInvalidLogin(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/authentication_token", ["json" => [
            "email" => "invalid_email",
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
    }

    public function testInvalidRegister(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/users", ["json" => [
            "email" => ""
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
