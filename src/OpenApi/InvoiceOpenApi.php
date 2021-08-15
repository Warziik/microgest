<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\OpenApi;
use Symfony\Component\HttpFoundation\Response;

class InvoiceOpenApi implements OpenApiFactoryInterface
{


    public const ALL_INVOICES_PATH = '/api/invoices';
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $this->generateAllInvoicesDoc($openApi);
        return $openApi;
    }

    private function generateAllInvoicesDoc(OpenApi $openApi)
    {
        $pathItem = $openApi->getPaths()->getPath(self::ALL_INVOICES_PATH);
        $operation = $pathItem->getGet();
        $openApi->getPaths()->addPath(self::ALL_INVOICES_PATH, $pathItem->withGet($operation
                ->withSummary("Gets all invoices belonging to all of the User's customers.")
                ->withDescription('')
                ->withResponses([
                    Response::HTTP_OK => [
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        '@context' => [
                                            'type' => 'string',
                                            'readOnly' => true,
                                        ],
                                        '@id' => [
                                            'type' => 'string',
                                            'readOnly' => true,
                                        ],
                                        '@type' => [
                                            'type' => 'string',
                                            'readOnly' => true,
                                        ],
                                        'allInvoices' => [
                                            'type' => 'array',
                                            'readOnly' => true,
                                            'items' => [
                                                'type' => 'object',
                                                'properties' => [
                                                    '@id' => [
                                                        'type' => 'string',
                                                        'readOnly' => true,
                                                    ],
                                                    '@type' => [
                                                        'type' => 'string',
                                                        'readOnly' => true,
                                                    ],
                                                    'id' => [
                                                        'type' => 'integer',
                                                        'readOnly' => true,
                                                    ],
                                                    'amount' => [
                                                        'type' => 'number',
                                                        'readOnly' => true,
                                                    ],
                                                    'status' => [
                                                        'type' => 'string',
                                                        'readOnly' => true,
                                                    ],
                                                    'customer' => [
                                                        'type' => 'object',
                                                    ],
                                                    'paidAt' => [
                                                        'type' => 'string',
                                                        'readOnly' => true,
                                                    ],
                                                    'sentAt' => [
                                                        'type' => 'string',
                                                        'readOnly' => true,
                                                    ],
                                                    'chrono' => [
                                                        'type' => 'string',
                                                        'readOnly' => true,
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    Response::HTTP_FORBIDDEN => ['description' => 'Access denied.'],
                ])));
    }
}
