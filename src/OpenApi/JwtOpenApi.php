<?php

namespace App\OpenApi;

use ArrayObject;
use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Model\PathItem;
use ApiPlatform\Core\OpenApi\Model\Operation;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use Symfony\Component\HttpFoundation\Response;

final class JwtOpenApi implements OpenApiFactoryInterface
{
    const AUTH_PATH = "/api/authentication_token";
    const REFRESH_TOKEN_PATH = "/api/authentication_token/refresh";
    const REVOKE_REFRESH_TOKEN_PATH = "/api/authentication_token/revoke";

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        $openApi->getPaths()->addPath(self::AUTH_PATH, new PathItem(
            post: new Operation(
                operationId: 'postCredentialsItem',
                summary: 'Gets a JWT Token to login',
                tags: ["JWT Token"],
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
                                            'readOnly' => true
                                        ]
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
        ));

        $openApi->getPaths()->addPath(self::REFRESH_TOKEN_PATH, new PathItem(
            post: new Operation(
                operationId: "askRefreshToken",
                summary: "Refreshes a JWT Token before it expires",
                tags: ["JWT Token"],
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
                                            'readOnly' => true
                                        ]
                                    ]
                                ],
                            ],
                        ],
                    ]
                ]
            )
        ));

        $openApi->getPaths()->addPath(self::REVOKE_REFRESH_TOKEN_PATH, new PathItem(
            post: new Operation(
                operationId: "revokeRefreshToken",
                summary: "Revokes the refresh token",
                tags: ["JWT Token"],
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
                                            'readOnly' => true
                                        ],
                                        'message' => [
                                            'type' => 'string',
                                            'readOnly' => true
                                        ]
                                    ],
                                    'example' => [
                                        'code' => Response::HTTP_OK,
                                        'message' => 'User logged out successfully.'
                                    ]
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
                                            'readOnly' => true
                                        ],
                                        'message' => [
                                            'type' => 'string',
                                            'readOnly' => true
                                        ]
                                    ],
                                    'example' => [
                                        'code' => Response::HTTP_BAD_REQUEST,
                                        'message' => 'No __refresh__token cookie found in the request headers.'
                                    ]
                                ],
                            ],
                        ],
                    ]
                ]
            )
        ));

        return $openApi;
    }
}
