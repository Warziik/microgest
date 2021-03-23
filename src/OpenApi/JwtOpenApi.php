<?php

namespace App\OpenApi;

use ArrayObject;
use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Model\PathItem;
use ApiPlatform\Core\OpenApi\Model\Operation;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;

final class JwtOpenApi implements OpenApiFactoryInterface
{
    const OPERATION_PATH = "/api/authentication_token";

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        $pathItem = new PathItem(
            post: new Operation(
                operationId: 'postCredentialsItem',
                summary: 'Gets a JWT Token to login',
                tags: ["JWT Token"],
                requestBody: new RequestBody(
                    description: 'Generate new JWT Token',
                    content: new ArrayObject([
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'email' => [
                                        'type' => 'string',
                                        'example' => 'johndoe@example.com',
                                    ],
                                    'password' => [
                                        'type' => 'string',
                                        'example' => 'demo123',
                                    ],
                                ]
                            ],
                        ],
                    ]),
                ),
                responses: [
                    '200' => [
                        'description' => 'Gets a JWT token',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'token' => [
                                            'type' => 'string',
                                            'readOnly' => true,
                                        ],
                                    ]
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'Invalid credentials. | Unconfirmed account.'
                    ]
                ]
            )
        );
        $openApi->getPaths()->addPath(self::OPERATION_PATH, $pathItem);

        return $openApi;
    }
}
