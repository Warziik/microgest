<?php
namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model;

class ForgotPasswordOpenApi implements OpenApiFactoryInterface {
    const OPERATION_PATH = "/api/users/forgot_password";

    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }
    
    public function __invoke(array $context = []): OpenApi {
        $openApi = $this->decorated->__invoke($context);
        $pathItem = $openApi->getPaths()->getPath(self::OPERATION_PATH);
        $operation = $pathItem->getPost();

        $openApi->getPaths()->addPath(self::OPERATION_PATH, $pathItem->withPost(
            $operation
            ->withSummary("Sends an email to reset the password.")
            ->withDescription("Get the User's email as body parameter and send an email which contains a link to reset the password")
            ->withRequestBody(
                new Model\RequestBody("The email address of the User to which the reset password email will be sent", new \ArrayObject(["application/ld+json" => ["schema" => ["type" => "string", "example" => ["email" => "string"]]]]), true)
            )->withResponses([
                "200" => ["description" => "Email sent successfully"],
                "400" => ["description" => "Email address must be provided as body parameter"],
                "404" => ["description" => "User not found"]
            ])
        ));
        
        return $openApi;
    }
}