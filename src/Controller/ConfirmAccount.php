<?php

namespace App\Controller;

use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ConfirmAccount
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function __invoke(User $data, Request $request)
    {
        $bodyContent = json_decode($request->getContent(), true);

        // ERROR: No token provided as body parameter
        if (empty($bodyContent) || !array_key_exists('token', $bodyContent)) {
            return new JsonResponse(
                ['code' => Response::HTTP_BAD_REQUEST, 'message' => 'Token is missing as body parameter.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // ERROR: Account already confirmed
        if (!is_null($data->getConfirmedAt())) {
            if (!is_null($data->getConfirmationToken())) {
                $data->setConfirmationToken(null);
                $this->entityManager->persist($data);
                $this->entityManager->flush();
            }

            return new JsonResponse(
                ['code' => Response::HTTP_UNAUTHORIZED, 'message' => 'Your account is already confirmed.'],
                Response::HTTP_UNAUTHORIZED
            );
        }

        // ERROR: Token provided as body parameter do not match with the User's confirmation token
        if ($data->getConfirmationToken() !== $bodyContent['token']) {
            return new JsonResponse(
                ['code' => Response::HTTP_BAD_REQUEST, 'message' => 'Token is invalid.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // SUCCESS
        $data->setConfirmationToken(null);
        $data->setConfirmedAt(new DateTime());

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return new JsonResponse(
            ['code' => Response::HTTP_OK, 'message' => 'Account confirmed successfully.'],
            Response::HTTP_OK
        );
    }
}
