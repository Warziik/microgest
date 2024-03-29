<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\KernelInterface;

#[AsController]
class Logout extends AbstractController
{
    public function logout(Request $request, KernelInterface $kernel): JsonResponse
    {
        $cookieName = $this->getParameter('app.jwt_refresh_token_cookie_name');
        if ($request->cookies->has($cookieName)) {
            $application = new Application($kernel);
            $application->setAutoExit(false);
            $input = new ArrayInput([
                'command' => 'gesdinet:jwt:revoke',
                'refresh_token' => $request->cookies->get($cookieName),
            ]);
            $status = $application->run($input, new NullOutput());

            if (0 === $status) {
                $response = new JsonResponse([], Response::HTTP_NO_CONTENT);
                $response->headers->setCookie(new Cookie($cookieName));
            } else {
                $response = new JsonResponse(
                    [
                        'code' => Response::HTTP_INTERNAL_SERVER_ERROR,
                        'message' => "Une erreur inattendue s'est produite, veuillez réessayer plus tard.",
                    ],
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }

            return $response;
        }

        return new JsonResponse(
            [
                'code' => Response::HTTP_BAD_REQUEST,
                'message' => "Aucun cookie __refresh__token n'a été trouvé dans l'en-tête de la requête.",
            ],
            Response::HTTP_BAD_REQUEST
        );
    }
}
