<?php
namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;

class JwtSuccessHandler extends AuthenticationSuccessHandler
{
    public function handleAuthenticationSuccess(UserInterface $user, $jwt = null)
    {
        // Check that a User do not try to login without having confirmed its account
        if (!is_null($user->getConfirmationToken()) || is_null($user->getConfirmedAt())) {
            return new JWTAuthenticationFailureResponse("Unconfirmed account.", Response::HTTP_FORBIDDEN);
        }

        return parent::handleAuthenticationSuccess($user, $jwt);
    }
}
