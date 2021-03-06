<?php
namespace App\Controller;

use App\Entity\Invoice;
use App\Repository\CustomerRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;

class CreateInvoice {
    public function __construct(private Security $security, private CustomerRepository $customerRepository)
    {
    }

    /**
     * Check that the User did not tried to set an Invoice for a Customer he didn't own
     */
    public function __invoke(Invoice $data)
    {
        $user = $this->security->getUser();
        $userCustomers = $this->customerRepository->findBy(["owner" => $user]);

        if (!in_array($data->getCustomer(), $userCustomers)) {
            return new JsonResponse(["code" => Response::HTTP_UNAUTHORIZED, "message" => "You cannot set an invoice for a customer you don't own."], Response::HTTP_UNAUTHORIZED);
        }

        return $data;
    }
}