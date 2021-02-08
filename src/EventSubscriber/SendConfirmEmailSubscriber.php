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
            KernelEvents::VIEW => ["onKernelView", EventPriorities::PRE_WRITE]
        ];
    }

    /**
     * Send a confirm account email to the User's email address before persisting in database
     * 
     * @param ViewEvent $event
     */
    public function onKernelView(ViewEvent $event)
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($entity instanceof User && $method === Request::METHOD_POST) {
            $entity->setConfirmationToken(sha1(random_bytes(rand(8, 10))));
            $this->userNotification->sendConfirmAccountEmail($entity);
        }
    }
}