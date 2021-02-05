<?php

namespace App\Tests\Controller;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\UserFixtures;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ForgotPasswordTest extends ApiTestCase
{
    use FixturesTrait;

    protected function setUp(): void
    {
        parent::setUp();

        $this->loadFixtures([UserFixtures::class]);
    }

    public function testValidRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/users/forgot_password", ["json" => [
            "email" => "testUser@localhost.dev"
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testInvalidRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/users/forgot_password", ["json" => [
            "test" => "invalid_field"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    public function testNotFoundResource(): void
    {
        static::createClient()->request(Request::METHOD_POST, "/api/users/forgot_password", ["json" => [
            "email" => "invalid_email"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
