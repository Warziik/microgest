<?php

namespace App\Tests\Entity;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class UserTest extends KernelTestCase
{
    /**
     * Return a valid User Entity
     * 
     * @return User
     */
    private function getEntity(): User
    {
        return (new User())
            ->setFirstname("Firstname")
            ->setLastname("LastName")
            ->setEmail("valid@email.fr")
            ->setPassword("demo1234");
    }

    /**
     * Test the validation constraints of an entity
     * 
     * @param int $nbErrorExpected Number of errors expected due to the validation constraints
     * @param User $entity Entity to test the validation constraints
     */
    private function assertHasErrors(int $nbErrorExpected, User $entity): void
    {
        self::bootKernel();
        $validator = self::$container->get('validator');
        $errors = $validator->validate($entity);
        $messages = [];

        foreach ($errors as $e) {
            $messages[] = $e->getPropertyPath() . " => " . $e->getMessage();
        }

        $this->assertCount($nbErrorExpected, $errors, implode(", ", $messages));
    }

    public function testFirstnameTooShort(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setFirstname("f"));
    }

    public function testInvalidBlankFirstname(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setFirstname(""));
    }

    public function testLastnameTooShort(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setLastname("f"));
    }

    public function testInvalidBlankLastname(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setLastname(""));
    }

    public function testInvalidEmail(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setEmail("invalid_email_format"));
    }

    public function testInvalidBlankEmail(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setEmail(""));
    }

    public function testPasswordTooShort(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setPassword("1"));
    }

    public function testInvalidBlankPassword(): void
    {
        $this->assertHasErrors(1, $this->getEntity()->setPassword(""));
    }
}
