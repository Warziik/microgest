<?php

namespace App\Controller;

use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ConfirmAccount extends AbstractController
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
                ['code' => Response::HTTP_BAD_REQUEST, 'message' => "Le token est manquant dans les paramètres POST de la requête."],
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
                ['code' => Response::HTTP_UNAUTHORIZED, 'message' => 'Votre compte est déjà confirmé.'],
                Response::HTTP_UNAUTHORIZED
            );
        }

        // ERROR: Token provided as body parameter do not match with the User's confirmation token
        if ($data->getConfirmationToken() !== $bodyContent['token']) {
            return new JsonResponse(
                ['code' => Response::HTTP_BAD_REQUEST, 'message' => 'Token invalide.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // SUCCESS
        $data->setConfirmationToken(null);
        $data->setConfirmedAt(new DateTime());

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return new JsonResponse(
            ['code' => Response::HTTP_OK, 'message' => "Votre compte a été confirmé avec succès."],
            Response::HTTP_OK
        );
    }
}
