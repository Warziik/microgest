<?php

namespace App\Controller;

use App\Entity\ResetPassword;
use App\Entity\User;
use App\Notification\UserNotification;
use App\Repository\ResetPasswordRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @see App\OpenApi\ForgotPasswordOpenApi
 */
class ForgotPassword
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
                    'message' => 'Email address must be provided as POST parameter.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);
        if (is_null($user)) {
            return new JsonResponse(
                [
                    'code' => Response::HTTP_NOT_FOUND,
                    'message' => 'User not found.',
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
                'message' => 'Email sent successfully.',
            ],
            Response::HTTP_OK
        );
    }
}
