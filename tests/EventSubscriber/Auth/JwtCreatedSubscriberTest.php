<?php

namespace App\Tests\EventSubsriber\Auth;

use App\Entity\User;
use App\EventSubscriber\Auth\JwtCreatedSubscriber;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use PHPUnit\Framework\TestCase;

class JwtCreatedSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(Events::JWT_CREATED, JwtCreatedSubscriber::getSubscribedEvents());
    }

    public function testChangeJwtPayload(): void
    {
        $mockJwtCreatedEvent = $this->createMock(JWTCreatedEvent::class);
        $mockUser = $this->createMock(User::class);

        $mockUser->expects($this->once())->method('getId')->willReturn(1);
        $mockUser->expects($this->once())->method('getFirstname')->willReturn('Alex');
        $mockUser->expects($this->once())->method('getLastname')->willReturn('Demo');
        $mockUser->expects($this->once())->method('getUsername')->willReturn('demoUser@localhost.dev');

        $mockJwtCreatedEvent->expects($this->once())->method('getData')
            ->willReturn(['roles' => ['ROLE_USER'], 'username' => 'demoUser@localhost.dev']);
        $mockJwtCreatedEvent->expects($this->once())->method('getUser')
            ->willReturn($mockUser);

        $mockJwtCreatedEvent->expects($this->once())->method('setData')
            ->with([
                'username' => 'demoUser@localhost.dev',
                'id' => 1,
                'firstname' => 'Alex',
                'lastname' => 'Demo',
                'email' => 'demoUser@localhost.dev',
            ]);

        $jwtCreatedSubscriber = new JwtCreatedSubscriber();
        $jwtCreatedSubscriber->onJwtCreated($mockJwtCreatedEvent);
    }

    public function testTryChangeJwtPayloadWithoutValidUser(): void
    {
        $mockJwtCreatedEvent = $this->createMock(JWTCreatedEvent::class);
        $invalidUser = new class() {
        };

        $mockJwtCreatedEvent->expects($this->once())->method('getUser')
            ->willReturn($invalidUser);

        // setData() should not be called if the User is not an instance of UserInterface
        $mockJwtCreatedEvent->expects($this->never())->method('setData');

        $jwtCreatedSubscriber = new JwtCreatedSubscriber();
        $jwtCreatedSubscriber->onJwtCreated($mockJwtCreatedEvent);
    }
}
