<?php

namespace App\Tests\Controller;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\JwtRefreshTokenFixtures;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class LogoutTest extends ApiTestCase
{
    private const REVOKE_REFRESH_TOKEN_URI = '/api/authentication_token/revoke';
    private string $cookieName = '__refresh__token';

    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    protected function setUp(): void
    {
        parent::setUp();

        static::bootKernel();
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $this->databaseTool->loadFixtures([JwtRefreshTokenFixtures::class]);
    }

    public function testLogout(): void
    {
        $client = static::createClient();
        $client->getCookieJar()->set(new Cookie(
            $this->cookieName,
            'demoRefreshToken',
            strtotime('+1 day')
        ));
        $client->request(Request::METHOD_POST, self::REVOKE_REFRESH_TOKEN_URI);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testLogoutWithInvalidRefreshToken(): void
    {
        $client = static::createClient();
        $client->getCookieJar()->set(new Cookie(
            $this->cookieName,
            'invalidRefreshToken',
            strtotime('+1 day')
        ));
        $client->request(Request::METHOD_POST, self::REVOKE_REFRESH_TOKEN_URI);

        $this->assertJsonContains([
            'code' => Response::HTTP_INTERNAL_SERVER_ERROR,
            'message' => "Une erreur inattendue s'est produite, veuillez réessayer plus tard.",
        ]);
    }

    public function testLogoutWithoutRefreshTokenCookie(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::REVOKE_REFRESH_TOKEN_URI);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains([
            'code' => Response::HTTP_BAD_REQUEST,
            'message' => "Aucun cookie __refresh__token n'a été trouvé dans l'en-tête de la requête.",
        ]);
    }
}
