<?php
namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model;

class ResetPasswordOpenApi implements OpenApiFactoryInterface {
    const OPERATION_PATH = "/api/users/reset_password";

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }
    
    public function __invoke(array $context = []): OpenApi {
        $openApi = $this->decorated->__invoke($context);
        $pathItem = $openApi->getPaths()->getPath(self::OPERATION_PATH);
        $operation = $pathItem->getPost();

        $openApi->getPaths()->addPath(self::OPERATION_PATH, $pathItem->withPost(
            $operation
            ->withSummary("Resets the User's password.")
            ->withDescription("")
            ->withRequestBody(
                new Model\RequestBody("The new password to set to the User and the hashed token generated when the User requested to reset his password", new \ArrayObject(["application/ld+json" => ["schema" => ["type" => "string", "example" => ["password" => "string", "token" => "string"]]]]), true)
            )->withResponses([
                "200" => ["description" => "Password changed successfully"],
                "401" => ["description" => "Token has expired"],
                "403" => ["description" => "Invalid body content"],
                "404" => ["description" => "ResetPassword resource not found"]
            ])
        ));
        
        return $openApi;
    }
}