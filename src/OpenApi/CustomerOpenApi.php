<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\OpenApi;

class CustomerOpenApi implements OpenApiFactoryInterface
{
    public const INVOICES_SUBRESOURCE_PATH = '/api/customers/{id}/invoices';
    public const PICTURE_PATH = '/api/customers/{id}/picture';
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        $this->generatePictureDoc($openApi);
        $this->generateInvoiceSubresourceDoc($openApi);
        return $openApi;
    }

    private function generatePictureDoc(OpenApi $openApi)
    {
        $pathItem = $openApi->getPaths()->getPath(self::PICTURE_PATH);
        $operation = $pathItem->getPost();
        $openApi->getPaths()->addPath(self::PICTURE_PATH, $pathItem->withPost($operation
            ->withSummary("Sets the Customer's picture")
            ->withDescription('')
            ->withParameters($operation->getParameters())
            ->withRequestBody(
                new RequestBody(
                    "The new Customer picture",
                    new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'pictureFile' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
            ->withResponses([
                '200' => [
                    'description' => 'Returns the picture url of the Customer',
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'pictureUrl' => [
                                        'type' => 'string',
                                        'example' => '/images/customers/example_picture.png'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                '400' => [
                    'description' => 'Un fichier (pictureFile) doit être passé en paramètre.'
                ]
            ])));
    }

    private function generateInvoiceSubresourceDoc(OpenApi $openApi)
    {
        $pathItem = $openApi->getPaths()->getPath(self::INVOICES_SUBRESOURCE_PATH);
        $operation = $pathItem->getGet();
        $openApi->getPaths()->addPath(self::INVOICES_SUBRESOURCE_PATH, $pathItem->withGet($operation
                ->withSummary("Retrieves the Invoices's collection of a Customer")
                ->withDescription('')
                ->withParameters($operation->getParameters())
                ->withResponses([
                    '200' => ['description' => 'Return the Invoices of the Customer'],
                ])));
    }
}
