<?php

namespace App\Tests\Security;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\UserFixtures;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserCheckerTest extends ApiTestCase
{
    use FixturesTrait;

    protected function setUp(): void
    {
        parent::setUp();
        $this->loadFixtures([UserFixtures::class]);
    }

    public function testLoginWithoutConfirmingItsAccount(): void
    {
        static::createClient()->request(Request::METHOD_POST, '/api/authentication_token', ['json' => [
            'email' => 'demoUser-1@localhost.dev',
            'password' => 'demo1234',
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertResponseHeaderSame('content-type', 'application/json');
        $this->assertJsonContains([
            'code' => Response::HTTP_UNAUTHORIZED,
            'message' => 'Unconfirmed account.',
        ]);
    }
}
