<?php

namespace App\Security\Voter;

use App\Entity\Customer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class SubresourceVoter extends Voter
{
    const GRANTED_ROLE = "GET_SUBRESOURCE";

    public function __construct(private EntityManagerInterface $em)
    {
    }

    protected function supports($attribute, $subject)
    {
        if ($attribute !== self::GRANTED_ROLE || !is_array($subject)) {
            return false;
        }

        return class_exists(array_keys($subject)[0]);
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        $className = array_keys($subject)[0];
        $id = $subject[$className]['id'];
        $user = $token->getUser();

        $entity = $this->em->getRepository($className)->find($id);
        if ($entity instanceof UserInterface && $entity === $user) {
            return true;
        }

        if ($entity instanceof Customer && $entity->getOwner() === $user) {
            return true;
        }

        return false;
    }
}
