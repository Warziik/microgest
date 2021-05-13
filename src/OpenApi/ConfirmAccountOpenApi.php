<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model;
use ApiPlatform\Core\OpenApi\OpenApi;

class ConfirmAccountOpenApi implements OpenApiFactoryInterface
{
    public const OPERATION_PATH = '/api/users/{id}/confirm_account';

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        $pathItem = $openApi->getPaths()->getPath(self::OPERATION_PATH);
        $operation = $pathItem->getPost();

        $openApi->getPaths()->addPath(self::OPERATION_PATH, $pathItem->withPost(
            $operation
                ->withSummary("Confirms the User's account.")
                ->withDescription('')
                ->withRequestBody(
                    new Model\RequestBody(
                        'The confirmation token generated when the User created its account. It has been sent by mail.',
                        new \ArrayObject([
                            'application/ld+json' => [
                                'schema' => [
                                    'type' => 'string', 'example' => ['token' => 'string'],
                                ],
                            ],
                        ]),
                        true
                    )
                )->withResponses([
                    '200' => ['description' => 'Account confirmed successfully'],
                    '401' => ['description' => 'Account already confirmed'],
                    '400' => ['description' => 'ConfirmationToken must be provided as body parameter'],
                    '404' => ['description' => 'User not found'],
                ])
        ));

        return $openApi;
    }
}
