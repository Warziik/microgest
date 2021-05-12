<?php

namespace App\EventSubscriber;

use App\Entity\Customer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class AddLoggedUserToCustomerSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ["onKernelView", EventPriorities::PRE_VALIDATE]
        ];
    }

    /**
     * Add the logged User to a Customer before validationg the entity.
     * 
     * @param ViewEvent $event
     */
    public function onKernelView(ViewEvent $event)
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        $user = $this->security->getUser();
        if ($entity instanceof Customer && $method === Request::METHOD_POST && $user instanceof User) {
            $entity->setOwner($user);
        }
    }
}
