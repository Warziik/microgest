<?php

namespace App\EventSubscriber\Auth;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class JwtCreatedSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            Events::JWT_CREATED => 'onJwtCreated',
        ];
    }

    public function onJwtCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

        unset($payload['roles']);

        $payload['id'] = $user->getId();
        $payload['username'] = $user->getUserIdentifier();

        $event->setData($payload);
    }
}
