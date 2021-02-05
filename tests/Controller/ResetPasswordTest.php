<?php

namespace App\Tests\Controller;

use App\Entity\ResetPassword;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\ResetPasswordFixtures;
use App\DataFixtures\UserFixtures;
use Doctrine\ORM\EntityManagerInterface;

class ResetPasswordTest extends ApiTestCase
{
    use FixturesTrait;

    private const RESET_PASSWORD_URI = "/api/users/reset_password";

    private ?EntityManagerInterface $em;

    protected function setUp(): void
    {
        parent::setUp();

        self::bootKernel();
        $this->loadFixtures([UserFixtures::class, ResetPasswordFixtures::class]);
        $this->em = self::$container->get("doctrine")->getManager();
    }

    /**
     * Return a valid reset password entity to make request
     */
    private function getResetPassword(): ResetPassword
    {
        return $this->em->getRepository(ResetPassword::class)->findOneBy(["user" => 1]);
    }

    /**
     * Test reset a password
     */
    public function testResetPasswordRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ["json" => [
            "password" => "test1234",
            "token" => $this->getResetPassword()->getToken()
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            "code" => Response::HTTP_OK,
            "message" => "Password changed successfully."
        ]);
    }

    /**
     * Test invalid request
     */
    public function testInvalidResetPasswordRequest(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ["json" => [
            "token" => $this->getResetPassword()->getToken()
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains([
            "code" => Response::HTTP_BAD_REQUEST,
            "message" => "Password or Token or both are missing as body parameters."
        ]);
    }

    /**
     * Test invalid token
     */
    public function testNotFoundResetPassword(): void
    {
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ["json" => [
            "password" => "test1234",
            "token" => "invalid_token"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
        $this->assertJsonContains([
            "code" => Response::HTTP_NOT_FOUND,
            "message" => "ResetPassword resource not found."
        ]);
    }

    /**
     * Test that a token is removed after being used one time
     */
    public function testReuseToken(): void
    {
        $token = $this->getResetPassword()->getToken();

        // Valid Request
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ["json" => [
            "password" => "test1234",
            "token" => $token,
        ]]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // Token has been deleted after the previous request so it is now invalid
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ["json" => [
            "password" => "test1234",
            "token" => $token,
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
        $this->assertJsonContains([
            "code" => Response::HTTP_NOT_FOUND,
            "message" => "ResetPassword resource not found."
        ]);
    }

    /**
     * Test token validation constraints (length & type)
     */
    public function testTokenValidationConstraints(): void
    {
        // Token is too short
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ["json" => [
            "password" => "test1234",
            "token" => "invalid"
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains([
            "code" => Response::HTTP_BAD_REQUEST,
            "message" => "Token invalid.",
            "violations" => [
                "This value is too short. It should have 10 characters or more."
            ]
        ]);

        // Token must be a string, integer given
        static::createClient()->request(Request::METHOD_POST, self::RESET_PASSWORD_URI, ["json" => [
            "password" => "test1234",
            "token" => 123456
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $this->assertJsonContains([
            "code" => Response::HTTP_BAD_REQUEST,
            "message" => "Token invalid.",
            "violations" => [
                "This value is too short. It should have 10 characters or more.",
                "This value should be of type string."
            ]
        ]);
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null;
    }
}
