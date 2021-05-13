<?php

namespace App\EventSubscriber\Auth;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RefreshJwtTokenSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private string $refreshTokenParameterName,
        private string $cookieName
    ) {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }

    /**
     * When the client calls "/api/authentication_token/refresh" with the cookie containing the refresh token
     * as request header, this method will intercept it and set an attribute in the request with the value of
     * the refresh token stored in the cookie to simulate that the refresh token has been provided as body parameter.
     */
    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        if (Request::METHOD_POST === $request->getMethod() &&
            'gesdinet_jwt_refresh_token' === $request->attributes->get('_route')
        ) {
            $request->attributes->set($this->refreshTokenParameterName, $request->cookies->get($this->cookieName));
        }
    }
}
