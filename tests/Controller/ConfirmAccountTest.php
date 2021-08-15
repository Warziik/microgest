<?php

namespace App\Tests\Controller;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\UserFixtures;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ConfirmAccountTest extends ApiTestCase
{
    public const CONFIRM_ACCOUNT_URI = '/api/users/2/confirm_account';

    private ?EntityManagerInterface $em;

    /** @var AbstractDatabaseTool */
    protected $databaseTool;

    protected function setUp(): void
    {
        parent::setUp();

        static::bootKernel();
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $this->databaseTool->loadFixtures([UserFixtures::class]);
        $this->em = static::getContainer()->get('doctrine')->getManager();
    }

    private function getUser(): User
    {
        return $this->em->getRepository(User::class)->findOneBy(['id' => 2]);
    }

    public function testConfirmAccountRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ['json' => [
            'token' => $this->getUser()->getConfirmationToken(),
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            'code' => Response::HTTP_OK,
            'message' => "Votre compte a été confirmé avec succès.",
        ]);
    }

    public function testInvalidConfirmAccountRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ['json' => [
            'invalid_field' => 'test',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains(
            ["hydra:description" => "Le token est manquant dans les paramètres POST de la requête."]
        );
    }

    public function testSendInvalidToken(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ['json' => [
            'token' => 'invalid_token',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains(["hydra:description" => "Token invalide."]);
    }

    public function testConfirmAccountAlreadyConfirmed(): void
    {
        // Account confirmation
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ['json' => [
            'token' => $this->getUser()->getConfirmationToken(),
        ]]);

        // Accunt already confirmed
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ['json' => [
            'token' => $this->getUser()->getConfirmationToken(),
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJsonContains(["hydra:description" => "Votre compte est déjà confirmé."]);
    }
}
