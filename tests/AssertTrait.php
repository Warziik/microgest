<?php

namespace App\Tests;

use App\DataFixtures\UserFixtures;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

trait AssertTrait
{
    /**
     * Retrieve an authorization JWT Token to make API call.
     *
     * @return string JWT Token
     */
    private function getAuthToken(): string
    {
        $this->databaseTool->loadFixtures([UserFixtures::class]);

        $response = static::createClient()->request(Request::METHOD_POST, '/api/authentication_token', ['json' => [
            'email' => 'testUser@localhost.dev',
            'password' => 'demo1234',
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        return $response->toArray()['token'];
    }

    /**
     * Test the validation constraints of an entity.
     *
     * @param int    $nbErrorExpected Number of errors expected due to the validation constraints
     * @param object $entity          Entity to test the validation constraints
     */
    private function assertHasErrors(int $nbErrorExpected, object $entity): void
    {
        static::bootKernel();
        $validator = static::getContainer()->get('validator');
        $errors = $validator->validate($entity);
        $messages = [];

        foreach ($errors as $e) {
            $messages[] = $e->getPropertyPath() . ' => ' . $e->getMessage();
        }

        $this->assertCount($nbErrorExpected, $errors, implode(', ', $messages));
    }
}
