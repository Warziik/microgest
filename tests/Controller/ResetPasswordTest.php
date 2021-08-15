<?php

namespace App\Tests\Controller;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\ResetPasswordFixtures;
use App\DataFixtures\UserFixtures;
use App\Entity\ResetPassword;
use Doctrine\ORM\EntityManagerInterface;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ResetPasswordTest extends ApiTestCase
{
    private const RESET_PASSWORD_URI = '/api/users/reset_password';
    private ?EntityManagerInterface $em;

    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    protected function setUp(): void
    {
        parent::setUp();

        static::bootKernel();
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $this->databaseTool->loadFixtures([UserFixtures::class, ResetPasswordFixtures::class]);
        $this->em = static::getContainer()->get('doctrine')->getManager();
    }

    /**
     * Return a valid reset password entity to make request.
     */
    private function getResetPassword(): ResetPassword
    {
        return $this->em->getRepository(ResetPassword::class)->findOneBy(['user' => 1]);
    }

    /**
     * Test reset a password.
     */
    public function testResetPasswordRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ['json' => [
            'password' => 'test1234',
            'token' => $this->getResetPassword()->getToken(),
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            'code' => Response::HTTP_OK,
            'message' => "Votre mot de passe a été changé avec succès.",
        ]);
    }

    /**
     * Test invalid request.
     */
    public function testInvalidResetPasswordRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ['json' => [
            'token' => $this->getResetPassword()->getToken(),
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains(
            ["hydra:description" =>
                "Le password ou le token ou les deux sont manquants dans les paramètres POST de la requête."
            ]
        );
    }

    /**
     * Test invalid token.
     */
    public function testNotFoundResetPassword(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ['json' => [
            'password' => 'test1234',
            'token' => 'invalid_token',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
        $this->assertJsonContains(
            ["hydra:description" => "La ressource relative à cette fonctionnalité n'a pas été trouvée."]
        );
    }

    /**
     * Test that a token is removed after being used one time.
     */
    public function testReuseToken(): void
    {
        $token = $this->getResetPassword()->getToken();

        // Valid Request
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ['json' => [
            'password' => 'test1234',
            'token' => $token,
        ]]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // Token has been deleted after the previous request so it is now invalid
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ['json' => [
            'password' => 'test1234',
            'token' => $token,
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
        $this->assertJsonContains(
            ["hydra:description" => "La ressource relative à cette fonctionnalité n'a pas été trouvée."]
        );
    }

    /**
     * Test token validation constraints (length & type).
     */
    public function testTokenValidationConstraints(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ['json' => [
            'password' => 'test1234',
            'token' => 'invalid',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains(["hydra:description" => "Token invalide."]);
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null;
    }
}
