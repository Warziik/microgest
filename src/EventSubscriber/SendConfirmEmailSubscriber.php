<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Notification\UserNotification;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class SendConfirmEmailSubscriber implements EventSubscriberInterface
{
    public function __construct(private UserNotification $userNotification)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['onPreWrite', EventPriorities::PRE_WRITE],
            KernelEvents::VIEW => ["onPostWrite", EventPriorities::POST_WRITE]
        ];
    }

    /**
     * Set a confirmation token to the User before sending the confirmation email.
     */
    public function onPreWrite(ViewEvent $event)
    {
        if ($this->isGoodRequest($event)) {
            $event->getControllerResult()->setConfirmationToken(sha1(random_bytes(rand(8, 10))));
        }
    }

    /**
     * Send a confirm account email to the User's email address after persisting the User in database.
     * 
     * @param ViewEvent $event
     */
    public function onPostWrite(ViewEvent $event)
    {
        if ($this->isGoodRequest($event)) {
            $this->userNotification->sendConfirmAccountEmail($event->getControllerResult());
        }
    }

    private function isGoodRequest(ViewEvent $event): bool
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($entity instanceof User && $method === Request::METHOD_POST) {
            return true;
        }
        return false;
    }
}
