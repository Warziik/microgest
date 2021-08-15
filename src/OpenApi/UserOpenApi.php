<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\OpenApi;

class UserOpenApi implements OpenApiFactoryInterface
{


    public const CONFIRM_ACCOUNT_PATH = '/api/users/{id}/confirm_account';
    public const FORGOT_PASSWORD_PATH = '/api/users/forgot_password';
    public const RESET_PASSWORD_PATH = '/api/users/reset_password';
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        $this->generateConfirmAccountDoc($openApi);
        $this->generateForgotPasswordDoc($openApi);
        $this->generateResetPasswordDoc($openApi);
        return $openApi;
    }

    private function generateConfirmAccountDoc(OpenApi $openApi)
    {
        $pathItem = $openApi->getPaths()->getPath(self::CONFIRM_ACCOUNT_PATH);
        $operation = $pathItem->getPost();
        $openApi->getPaths()->addPath(self::CONFIRM_ACCOUNT_PATH, $pathItem->withPost($operation
                ->withSummary("Confirms the User's account.")
                ->withDescription('')
                ->withRequestBody(new RequestBody(
                    'The confirmation token generated when the User created its account.
                    It has been sent by mail.',
                    new \ArrayObject([
                            'application/ld+json' => [
                                'schema' => [
                                    'type' => 'string', 'example' => ['token' => 'string'],
                                ],
                            ],
                    ]),
                    true
                ))->withResponses([
                    '200' => ['description' => 'Account confirmed successfully'],
                    '401' => ['description' => 'Account already confirmed'],
                    '400' => ['description' => 'ConfirmationToken must be provided as body parameter'],
                    '404' => ['description' => 'User not found'],
                    ])));
    }

    private function generateForgotPasswordDoc(OpenApi $openApi)
    {
        $pathItem = $openApi->getPaths()->getPath(self::FORGOT_PASSWORD_PATH);
        $operation = $pathItem->getPost();
        $openApi->getPaths()->addPath(self::FORGOT_PASSWORD_PATH, $pathItem->withPost($operation
                ->withSummary('Sends an email to reset the password.')
                ->withDescription(
                    "Get the User's email as body parameter and send an email which contains
                    a link to reset the password"
                )
                ->withRequestBody(
                    new RequestBody(
                        'The email address of the User to which the reset password email will be sent',
                        new \ArrayObject([
                            'application/ld+json' => [
                                'schema' => [
                                    'type' => 'string', 'example' => ['email' => 'string'],
                                ],
                            ],
                        ]),
                        true
                    )
                )->withResponses([
                    '200' => ['description' => 'Email sent successfully'],
                    '400' => ['description' => 'Email address must be provided as body parameter'],
                    '404' => ['description' => 'User not found'],
                        ])));
    }

    private function generateResetPasswordDoc(OpenApi $openApi)
    {
        $pathItem = $openApi->getPaths()->getPath(self::RESET_PASSWORD_PATH);
        $operation = $pathItem->getPost();
        $openApi->getPaths()->addPath(self::RESET_PASSWORD_PATH, $pathItem->withPost($operation
                ->withSummary("Resets the User's password.")
                ->withDescription('')
                ->withRequestBody(new RequestBody('The new password to set to the User and the hashed token generated
                        when the User requested to reset his password', new \ArrayObject([
                                'application/ld+json' => [
                                    'schema' => [
                                        'type' => 'string', 'example' => [
                                            'password' => 'string', 'token' => 'string',
                                        ],
                                    ],
                                ],
                            ]), true))->withResponses([
                    '200' => ['description' => 'Password changed successfully'],
                    '401' => ['description' => 'Token has expired'],
                    '403' => ['description' => 'Invalid body content'],
                    '404' => ['description' => 'ResetPassword resource not found'],
                ])));
    }
}
