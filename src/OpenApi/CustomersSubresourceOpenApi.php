<?php
namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;

class CustomersSubresourceOpenApi implements OpenApiFactoryInterface {
    const OPERATION_PATH = "/api/users/{id}/customers";

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }
    
    public function __invoke(array $context = []): OpenApi {
        $openApi = $this->decorated->__invoke($context);
        $pathItem = $openApi->getPaths()->getPath(self::OPERATION_PATH);
        $operation = $pathItem->getGet();

        $openApi->getPaths()->addPath(self::OPERATION_PATH, $pathItem->withGet(
            $operation
            ->withSummary("Retrieves the Customers's collection of a User")
            ->withDescription("")
            ->withParameters($operation->getParameters())
            ->withResponses([
                "200" => ["description" => "Return the Customers of the User"]
            ])
        ));
        
        return $openApi;
    }
}