<?php

namespace App\Tests\EventSubscriber\Auth;

use App\EventSubscriber\Auth\AuthenticationFailureSubscriber;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use PHPUnit\Framework\TestCase;

class AuthenticationFailureSubscriberTest extends TestCase
{
    public function testEventSubscription(): void
    {
        $this->assertArrayHasKey(
            Events::AUTHENTICATION_FAILURE,
            AuthenticationFailureSubscriber::getSubscribedEvents()
        );
    }
}
