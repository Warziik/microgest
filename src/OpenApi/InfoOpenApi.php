<?php

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\Info;
use ApiPlatform\Core\OpenApi\OpenApi;

final class InfoOpenApi implements OpenApiFactoryInterface
{
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        $openApi = $openApi->withInfo(
            new Info('Microgest', 'v1', '')
        );

        return $openApi;
    }
}
