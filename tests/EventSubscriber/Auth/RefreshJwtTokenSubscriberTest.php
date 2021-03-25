<?php

namespace App\Tests\EventSubsriber\Auth;

use App\EventSubscriber\Auth\RefreshJwtTokenSubscriber;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RefreshJwtTokenSubscriberTest extends TestCase
{
    private string $cookieName = "__refresh__token";
    private string $refreshTokenParameterName = "refresh_token";

    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(KernelEvents::REQUEST, RefreshJwtTokenSubscriber::getSubscribedEvents());
    }

    public function testConvertCookieIntoRequestAttribute(): void
    {
        $mockRequestEvent = $this->createMock(RequestEvent::class);
        $mockRequest = $this->createMock(Request::class);
        $mockAttributesProperty = $this->createMock(ParameterBag::class);
        $mockCookiesProperty = $this->createMock(ParameterBag::class);

        $mockRequest->attributes = $mockAttributesProperty;
        $mockRequest->cookies = $mockCookiesProperty;

        $mockRequestEvent->expects($this->once())->method("getRequest")->willReturn($mockRequest);

        $mockRequest->expects($this->once())->method("getMethod")->willReturn(Request::METHOD_POST);

        $mockAttributesProperty->expects($this->once())->method("get")->with("_route")
            ->willReturn("gesdinet_jwt_refresh_token");

        $mockCookiesProperty->expects($this->once())->method("get")->with($this->cookieName)
            ->willReturn("demoRefreshToken");

        $mockAttributesProperty->expects($this->once())->method("set")
            ->with($this->refreshTokenParameterName, "demoRefreshToken");

        $refreshJwtTokenSubscriber = new RefreshJwtTokenSubscriber($this->refreshTokenParameterName, $this->cookieName);
        $refreshJwtTokenSubscriber->onKernelRequest($mockRequestEvent);
    }

    public function testInvalidHttpMethod(): void
    {
        $mockRequestEvent = $this->createMock(RequestEvent::class);
        $mockRequest = $this->createMock(Request::class);
        $mockAttributesProperty = $this->createMock(ParameterBag::class);

        $mockRequest->attributes = $mockAttributesProperty;

        $mockRequestEvent->expects($this->once())->method("getRequest")->willReturn($mockRequest);
        $mockRequest->expects($this->once())->method("getMethod")->willReturn(Request::METHOD_GET);

        // set() should not be called because the Http method is not POST
        $mockAttributesProperty->expects($this->never())->method("set");

        $refreshJwtTokenSubscriber = new RefreshJwtTokenSubscriber($this->refreshTokenParameterName, $this->cookieName);
        $refreshJwtTokenSubscriber->onKernelRequest($mockRequestEvent);
    }
}
