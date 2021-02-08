<?php
namespace App\Tests\Controller;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\UserFixtures;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ConfirmAccountTest extends ApiTestCase
{
    use FixturesTrait;

    const CONFIRM_ACCOUNT_URI = "/api/users/1/confirm_account";

    private ?EntityManagerInterface $em;

    protected function setUp(): void {
        parent::setUp();

        $this->loadFixtures([UserFixtures::class]);
        $this->em = self::$container->get("doctrine")->getManager();
    }

    private function getUser(): User
    {
        return $this->em->getRepository(User::class)->findOneBy(["email" => "testUser@localhost.dev"]);
    }

    public function testConfirmAccountRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ["json" => [
            "token" => $this->getUser()->getConfirmationToken()
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            "code" => Response::HTTP_OK,
            "message" => "Account confirmed successfully."
        ]);
    }

    public function testInvalidConfirmAccountRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ["json" => [
            "invalid_field" => "test"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains([
            "code" => Response::HTTP_BAD_REQUEST,
            "message" => "Token is missing as body parameter."
        ]);
    }

    public function testSendInvalidToken(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ["json" => [
            "token" => "invalid_token"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains([
            "code" => Response::HTTP_BAD_REQUEST,
            "message" => "Token is invalid."
        ]);
    }

    public function testConfirmAccountAlreadyConfirmed(): void
    {
        // Account confirmation
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ["json" => [
            "token" => $this->getUser()->getConfirmationToken()
        ]]);

        // Accunt already confirmed
        static::createClient()->request(Request::METHOD_POST, self::CONFIRM_ACCOUNT_URI, ["json" => [
            "token" => $this->getUser()->getConfirmationToken()
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJsonContains([
            "code" => Response::HTTP_UNAUTHORIZED,
            "message" => "Your account is already confirmed."
        ]);
    }
}