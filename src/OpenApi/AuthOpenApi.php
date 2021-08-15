<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\Operation;
use ApiPlatform\Core\OpenApi\Model\PathItem;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\OpenApi;
use ArrayObject;
use Symfony\Component\HttpFoundation\Response;

final class AuthOpenApi implements OpenApiFactoryInterface
{
    public const AUTH_PATH = '/api/authentication_token';
    public const REFRESH_TOKEN_PATH = '/api/authentication_token/refresh';
    public const REVOKE_REFRESH_TOKEN_PATH = '/api/authentication_token/revoke';

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        $openApi->getPaths()->addPath(self::AUTH_PATH, new PathItem(
            post: new Operation(
                operationId: 'postCredentialsItem',
                tags: ['JWT Token'],
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
                                    ],
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'Invalid credentials. | Unconfirmed account.',
                    ],
                ],
                summary: 'Gets a JWT Token to login',
                requestBody: new RequestBody(
                    description: 'Generate a new JWT Token',
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
                                ],
                            ],
                        ],
                    ]),
                )
            )
        ));

        $openApi->getPaths()->addPath(self::REFRESH_TOKEN_PATH, new PathItem(
            post: new Operation(
                operationId: 'askRefreshToken',
                tags: ['JWT Token'],
                responses: [
                    '200' => [
                        'description' => 'Returns a new JWT Token by using the refresh token stored in the cookie.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'token' => [
                                            'type' => 'string',
                                            'readOnly' => true,
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                summary: 'Refreshes a JWT Token before it expires'
            )
        ));

        $openApi->getPaths()->addPath(self::REVOKE_REFRESH_TOKEN_PATH, new PathItem(
            post: new Operation(
                operationId: 'revokeRefreshToken',
                tags: ['JWT Token'],
                responses: [
                    '200' => [
                        'description' => 'Logout the User by deleting the cookie containing the refresh token.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'code' => [
                                            'type' => 'integer',
                                            'readOnly' => true,
                                        ],
                                        'message' => [
                                            'type' => 'string',
                                            'readOnly' => true,
                                        ],
                                    ],
                                    'example' => [
                                        'code' => Response::HTTP_OK,
                                        'message' => 'User logged out successfully.',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    '400' => [
                        'description' => 'No __refresh__token cookie found in the request headers.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'code' => [
                                            'type' => 'integer',
                                            'readOnly' => true,
                                        ],
                                        'message' => [
                                            'type' => 'string',
                                            'readOnly' => true,
                                        ],
                                    ],
                                    'example' => [
                                        'code' => Response::HTTP_BAD_REQUEST,
                                        'message' => 'No __refresh__token cookie found in the request headers.',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                summary: 'Revokes the refresh token'
            )
        ));

        return $openApi;
    }
}
