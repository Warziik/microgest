<?php

namespace App\Tests;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\UserFixtures;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthTest extends ApiTestCase
{
    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    public function setUp(): void
    {
        static::bootKernel();
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $this->databaseTool->loadFixtures([UserFixtures::class]);
    }

    public function testLogin(): void
    {
        $client = static::createClient();
        $client->request(Request::METHOD_POST, '/api/authentication_token', ['json' => [
            'email' => 'testUser@localhost.dev',
            'password' => 'demo1234',
        ]]);
        $this->assertResponseIsSuccessful();
        $this->assertInstanceOf(Cookie::class, $client->getCookieJar()->get('__refresh__token'));
    }

    public function testInvalidLogin(): void
    {
        static::createClient()->request(Request::METHOD_POST, '/api/authentication_token', ['json' => [
            'email' => 'invalid_email',
            'password' => 'demo1234',
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertResponseHeaderSame('content-type', 'application/json');
        $this->assertJsonContains([
            'code' => Response::HTTP_UNAUTHORIZED,
            'message' => "Identifiant ou mot de passe invalide.",
        ]);
    }

    public function testRegister(): void
    {
        $response = static::createClient()->request(Request::METHOD_POST, '/api/users', ['json' => [
            'firstname' => 'demoUser-firstname',
            'lastname' => 'demoUser-lastname',
            'email' => 'demo@domain.fr',
            'password' => 'demo1234',
            'siret' => '12345678912345',
            'address' => '119 avenue Aléatoire',
            'city' => 'Paris',
            'postalCode' => 75000,
            'country' => 'FRA',
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@type' => 'User',
            'firstname' => 'demoUser-firstname',
            'lastname' => 'demoUser-lastname',
            'email' => 'demo@domain.fr',
            'roles' => ['ROLE_USER'],
            'siret' => '12345678912345',
            'address' => '119 avenue Aléatoire',
            'city' => 'Paris',
            'postalCode' => 75000,
            'country' => 'FRA',
        ]);

        $this->assertMatchesRegularExpression('~^/api/users/\d+$~', $response->toArray()['@id']);
    }

    public function testInvalidRegister(): void
    {
        static::createClient()->request(Request::METHOD_POST, '/api/users', ['json' => [
            'email' => '',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
