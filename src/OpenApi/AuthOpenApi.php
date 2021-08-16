<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\Operation;
use ApiPlatform\Core\OpenApi\Model\PathItem;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\Model\SecurityScheme;
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

        $securitySchemes = $openApi->getComponents()->getSecuritySchemes();
        unset($securitySchemes["Token"]);
        $securitySchemes["bearerAuth"] = new SecurityScheme(
            description: "Authentication JWT",
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        );

        $openApi = $openApi->withSecurity([["bearerAuth" => []]]);

        $openApi->getPaths()->addPath(self::AUTH_PATH, new PathItem(
            post: new Operation(
                operationId: 'postCredentialsItem',
                tags: ['Auth'],
                responses: [
                    '200' => [
                        'description' => "Gets a JWT token and the logged User data",
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'userData' => [
                                            '$ref' => '#/components/schemas/User-users.read'
                                        ],
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
                tags: ['Auth'],
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
                tags: ['Auth'],
                responses: [
                    '204' => [
                        'description' => "L'utilisateur a été déconnecté avec succès.",
                    ],
                    '400' => [
                        'description' => "Aucun cookie __refresh__token n'a été trouvé dans l'en-tête de la requête."
                    ],
                ],
                summary: 'Revokes the refresh token'
            )
        ));

        return $openApi;
    }
}
