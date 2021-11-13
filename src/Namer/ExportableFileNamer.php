<?php
namespace App\Namer;

use App\Entity\Devis;
use App\Entity\Invoice;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\NamerInterface;

class ExportableFileNamer implements NamerInterface {
    public function name($object, PropertyMapping $mapping): string
    {
        if ($object instanceof Invoice) {
            $nameStartType = "Facture_";
        } elseif ($object instanceof Devis) {
            $nameStartType = "Devis_";
        } else {
            $nameStartType = "";
        }

        return
            $nameStartType . $object->getChrono() . "_" .
            date_format($object->getUndraftedAt(), "d-m-Y") . "." .
            $mapping->getFile($object)->getExtension();
    }
}