<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\OpenApi;

class InvoicesSubresourceOpenApi implements OpenApiFactoryInterface
{
    public const OPERATION_PATH = '/api/customers/{id}/invoices';

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        $pathItem = $openApi->getPaths()->getPath(self::OPERATION_PATH);
        $operation = $pathItem->getGet();

        $openApi->getPaths()->addPath(self::OPERATION_PATH, $pathItem->withGet(
            $operation
            ->withSummary("Retrieves the Invoices's collection of a Customer")
            ->withDescription('')
            ->withParameters($operation->getParameters())
            ->withResponses([
                '200' => ['description' => 'Return the Invoices of the Customer'],
            ])
        ));

        return $openApi;
    }
}
