<?php

namespace App\Tests\EventSubscriber\Auth;

use App\Entity\User;
use App\EventSubscriber\Auth\AuthenticationSuccessSubscriber;
use DateInterval;
use DateTime;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class AuthenticationSuccessSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(
            Events::AUTHENTICATION_SUCCESS,
            AuthenticationSuccessSubscriber::getSubscribedEvents()
        );
    }

    public function testSetCookieOnAuthenticationSuccess(): void
    {
        $cookieName = '__refresh__token';
        $refreshTokenParameterName = 'refresh_token';
        $refreshTokenTtl = 900;

        $mockResponse = $this->createMock(Response::class);
        $mockResponseHeaderBag = $this->createMock(ResponseHeaderBag::class);
        $mockAuthenticationSuccessEvent = $this->createMock(AuthenticationSuccessEvent::class);
        $mockUser = $this->createMock(User::class);

        $mockResponse->headers = $mockResponseHeaderBag;

        $mockUser->expects($this->once())->method('getId');
        $mockUser->expects($this->once())->method('getFirstname');
        $mockUser->expects($this->once())->method('getLastname');
        $mockUser->expects($this->once())->method('getEmail');
        $mockUser->expects($this->once())->method('getPhone');
        $mockUser->expects($this->once())->method('getBusinessName');
        $mockUser->expects($this->once())->method('getSiret');
        $mockUser->expects($this->once())->method('getTvaNumber');
        $mockUser->expects($this->once())->method('getAddress');
        $mockUser->expects($this->once())->method('getCity');
        $mockUser->expects($this->once())->method('getPostalCode');
        $mockUser->expects($this->once())->method('getCountry');

        $mockAuthenticationSuccessEvent->expects($this->once())
            ->method('getResponse')->willReturn($mockResponse);

        $mockAuthenticationSuccessEvent->expects($this->once())
            ->method('getUser')->willReturn($mockUser);

        $mockAuthenticationSuccessEvent->expects($this->atLeast(2))
            ->method('getData')->willReturn(['token' => 'demoToken', 'refresh_token' => 'demoRefreshToken']);

        $mockResponseHeaderBag->expects($this->once())
            ->method('setCookie')->with(new Cookie(
                $cookieName,
                'demoRefreshToken',
                (new DateTime())->add(new DateInterval('PT' . $refreshTokenTtl . 'S')),
                '/',
                null,
                true,
                true
            ));

        $mockAuthenticationSuccessEvent->expects($this->once())->method('setData');

        $subscriber = new AuthenticationSuccessSubscriber($refreshTokenTtl, $refreshTokenParameterName, $cookieName);
        $subscriber->onAuthenticationSuccess($mockAuthenticationSuccessEvent);
    }
}
