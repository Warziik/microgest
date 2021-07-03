<?php

namespace App\Controller;

use App\Repository\ResetPasswordRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @see App\OpenApi\ResetPasswordOpenApi
 */
#[AsController]
class ResetPassword extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private ResetPasswordRepository $resetPasswordRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {
    }

    public function __invoke(Request $request)
    {
        $bodyContent = json_decode($request->getContent(), true);
        if (
            empty($bodyContent) || !array_key_exists('password', $bodyContent) ||
            !array_key_exists('token', $bodyContent)
        ) {
            return new JsonResponse(
                [
                    'code' => Response::HTTP_BAD_REQUEST,
                    'message' => 'Password or Token or both are missing as body parameters.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $errors = $this->validator->validate($bodyContent['token'], [new Length(null, 10, 255), new Type('string')]);
        if (count($errors) > 0) {
            $responseData = [
                'code' => Response::HTTP_BAD_REQUEST,
                'message' => 'Token invalid.', 'violations' => [],
            ];
            foreach ($errors as $error) {
                $responseData['violations'][] = $error->getMessage();
            }

            return new JsonResponse($responseData, Response::HTTP_BAD_REQUEST);
        }

        $resetPassword = $this->resetPasswordRepository->findOneBy(['token' => $bodyContent['token']]);
        if (is_null($resetPassword)) {
            return new JsonResponse(
                [
                    'code' => Response::HTTP_NOT_FOUND,
                    'message' => 'ResetPassword resource not found.',
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        if ($resetPassword->getExpiresAt() < new DateTimeImmutable()) {
            $this->entityManager->remove($resetPassword);
            $this->entityManager->flush();

            return new JsonResponse(
                [
                    'code' => Response::HTTP_UNAUTHORIZED,
                    'message' => 'Token has expired.',
                ],
                Response::HTTP_FORBIDDEN
            );
        }

        $user = $this->userRepository->find($resetPassword->getUser()->getId());
        $user->setPassword($this->passwordHasher->hashPassword($user, $bodyContent['password']));

        $this->entityManager->remove($resetPassword);
        $this->entityManager->flush();

        return new JsonResponse(
            [
                'code' => Response::HTTP_OK,
                'message' => 'Password changed successfully.',
            ],
            Response::HTTP_OK
        );
    }
}
