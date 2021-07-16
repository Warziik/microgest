<?php

namespace App\Controller;

use App\Entity\Devis;
use App\Entity\Invoice;
use App\Repository\CustomerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Security;

#[AsController]
class CreateUpdateInvoice extends AbstractController
{
    public function __construct(private Security $security, private CustomerRepository $customerRepository)
    {
    }

    /**
     * Check that the User did not tried to set an Invoice or a Devis for a Customer he didn't own.
     */
    public function __invoke(Invoice|Devis $data)
    {
        $user = $this->security->getUser();
        $userCustomers = $this->customerRepository->findBy(['owner' => $user]);

        if (is_null($data->getCustomer())) {
            return new JsonResponse(
                [
                    'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                    'message' => "Un client doit être fourni.",
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (!in_array($data->getCustomer(), $userCustomers)) {
            return new JsonResponse(
                [
                    'code' => Response::HTTP_UNAUTHORIZED,
                    'message' => "Vous ne pouvez pas assigner une facture à un client que vous ne possédez pas.",
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }

        return $data;
    }
}
