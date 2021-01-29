<?php

namespace App\Tests\Security\Voter;

use App\Entity\Customer;
use App\Entity\User;
use App\Repository\CustomerRepository;
use App\Repository\UserRepository;
use App\Security\Voter\SubresourceVoter;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class SubresourceVoterTest extends TestCase
{
    public function testVoteAccessGranted(): void
    {
        $user = $this->createMock(User::class);
        $user->method("getId")->willReturn(1);

        $userRepository = $this->createMock(UserRepository::class);
        $userRepository->expects($this->once())
            ->method('find')
            ->willReturn($user);

        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->any())
            ->method('getRepository')
            ->willReturn($userRepository);

        $token = $this->createMock(TokenInterface::class);
        $token->expects($this->any())->method("getUser")->willReturn($user);

        $subject = [\App\Entity\User::class => ['id' => 1]];

        $subresourceVoter = new SubresourceVoter($entityManager);
        $this->assertSame(VoterInterface::ACCESS_GRANTED, $subresourceVoter->vote($token, $subject, ["GET_SUBRESOURCE"]));
    }

    public function testVoteAccessDenied(): void
    {
        $user = $this->createMock(User::class);
        $user->method("getId")->willReturn(1);

        $customer = $this->createMock(Customer::class);
        $customer->method("getId")->willReturn(1);
        $customer->method("getOwner")->willReturn(new User());

        $customerRepository = $this->createMock(CustomerRepository::class);
        $customerRepository->expects($this->once())
            ->method('find')
            ->willReturn($customer);

        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->any())
            ->method('getRepository')
            ->willReturn($customerRepository);

        $token = $this->createMock(TokenInterface::class);
        $token->expects($this->any())->method("getUser")->willReturn($user);

        $subject = [\App\Entity\Customer::class => ['id' => 1]];

        $subresourceVoter = new SubresourceVoter($entityManager);
        $this->assertSame(VoterInterface::ACCESS_DENIED, $subresourceVoter->vote($token, $subject, ["GET_SUBRESOURCE"]));
    }
}
