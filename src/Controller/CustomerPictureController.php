<?php
namespace App\Controller;

use App\Entity\Customer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class CustomerPictureController extends AbstractController {
    public function __invoke(Request $request)
    {
        $customer = $request->attributes->get('data');
        if (!($customer instanceof Customer)) {
            throw new \RuntimeException('Un client est attendu.');
        }
        if (!$request->files->has("pictureFile")) {
            throw new BadRequestException("Un fichier (pictureFile) doit être passé en paramètre.");
        }
        $customer->setPictureFile($request->files->get('pictureFile'));
        return $customer;
    }
    
}