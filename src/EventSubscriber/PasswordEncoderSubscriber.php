<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

final class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    public function __construct(private UserPasswordEncoderInterface $passwordEncoder)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ["onKernelView", EventPriorities::PRE_WRITE],
        ];
    }

    /**
     * Encode the password before persisting in database if the entity is an instance of User
     * and the request's method is POST
     * 
     * @param ViewEvent $event
     */
    public function onKernelView(ViewEvent $event)
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($entity instanceof User && $method === Request::METHOD_POST) {
            $entity->setPassword($this->passwordEncoder->encodePassword($entity, $entity->getPassword()));
        }
    }
}
