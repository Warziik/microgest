<?php

namespace App\EventSubscriber\Auth;

use DateInterval;
use DateTime;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;

final class AuthenticationSuccessSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private int $refreshTokeNTtl,
        private string $refreshTokenParameterName,
        private string $cookieName
    ) {
    }

    public static function getSubscribedEvents()
    {
        return [
            Events::AUTHENTICATION_SUCCESS => 'onAuthenticationSuccess',
        ];
    }

    /**
     * Set a cookie after the User's authentication containing the refresh token needed to ask
     * a new JWT Token before it expires.
     * To get a new one, the client will make a request to /api/authentication_token/refresh
     * with the cookie in the request headers.
     */
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $refreshToken = $event->getData()[$this->refreshTokenParameterName];
        $response = $event->getResponse();
        $response->headers->setCookie(
            new Cookie(
                $this->cookieName,
                $refreshToken,
                (new DateTime())->add(new DateInterval('PT' . $this->refreshTokeNTtl . 'S')),
                '/',
                null,
                true,
                true
            )
        );
        $event->setData(['token' => $event->getData()['token']]);
    }
}
