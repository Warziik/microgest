<?php
namespace App\Controller;

use App\Entity\Devis;
use App\Entity\Invoice;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Vich\UploaderBundle\Handler\DownloadHandler;

#[AsController]
class DownloadExportableDocument {
    public function __construct(private DownloadHandler $downloadHandler) {
    }

    public function __invoke(Invoice|Devis $data, Request $request)
    {
        return $this->downloadHandler->downloadObject($data, "file");
    }
}