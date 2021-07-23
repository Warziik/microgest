<?php

namespace App\EventSubscriber\Auth;

use App\Entity\User;
use DateInterval;
use DateTime;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Security\Core\User\UserInterface;

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
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

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

        $event->setData([
            'userData' => [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'email' => $user->getEmail(),
                'phone' => $user->getPhone(),
                'businessName' => $user->getBusinessName(),
                'siret' => $user->getSiret(),
                'tvaNumber' => $user->getTvaNumber(),
                'address' => $user->getAddress(),
                'city' => $user->getCity(),
                'postalCode' => $user->getPostalCode(),
                'country' => $user->getCountry()
            ],
            'token' => $event->getData()['token']]);
    }
}
