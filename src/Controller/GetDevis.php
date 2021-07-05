<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\DevisRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Security;

#[AsController]
class GetDevis extends AbstractController
{
    public function __construct(private Security $security, private DevisRepository $devisRepository)
    {
    }

    public function __invoke()
    {
        $data = [];

        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return;
        }

        foreach ($user->getCustomers() as $customer) {
            foreach ($customer->getDevis() as $devis) {
                $data[] = $devis;
            }
        }

        return $data;
    }
}
