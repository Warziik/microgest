<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class Frontend extends AbstractController
{
    #[Route(
        '/{reactRouting}',
        name: 'app',
        requirements: ['reactRouting' => '^(?!api|build).+'],
        defaults: ['reactRouting' => null]
    )]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }
}
