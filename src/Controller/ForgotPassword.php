<?php

namespace App\Controller;

use App\Entity\ResetPassword;
use App\Entity\User;
use App\Notification\UserNotification;
use App\Repository\ResetPasswordRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

/**
 * @see App\OpenApi\ForgotPasswordOpenApi
 */
#[AsController]
class ForgotPassword extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private ResetPasswordRepository $resetPasswordRepository,
        private EntityManagerInterface $entityManager,
        private UserNotification $userNotification
    ) {
    }

    public function __invoke(User $data)
    {
        $email = $data->getEmail();
        if (is_null($email)) {
            return new JsonResponse(
                [
                    'code' => Response::HTTP_BAD_REQUEST,
                    'message' => "L'adresse email doit être passé comme paramètre dans le requête POST.",
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);
        if (is_null($user)) {
            return new JsonResponse(
                [
                    'code' => Response::HTTP_NOT_FOUND,
                    'message' => "L'utilisateur n'a pas été trouvé.",
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $resetPassword = (new ResetPassword())->setUser($user);

        $this->entityManager->persist($resetPassword);
        $this->entityManager->flush();

        $this->userNotification->sendResetPasswordMail($user, $resetPassword);

        return new JsonResponse(
            [
                'code' => Response::HTTP_OK,
                'message' => "Le mail a été envoyé avec succès.",
            ],
            Response::HTTP_OK
        );
    }
}
