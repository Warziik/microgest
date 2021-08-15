<?php

namespace App\Serializer;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class UserOwnedDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;


    private const ALREADY_CALLED = 'USEROWNED_DENORMALIZER_ALREADY_CALLED';

    public function __construct(private Security $security)
    {
    }

    public function supportsDenormalization($data, string $type, string $format = null, array $context = []): bool
    {
        if (isset($data[self::ALREADY_CALLED])) {
            return false;
        }
        return $type === Customer::class && $context["operation_type"] === "collection";
    }

    public function denormalize($data, string $type, string $format = null, array $context = [])
    {
        $data[self::ALREADY_CALLED] = true;
/** @var Customer $object */
        $object = $this->denormalizer->denormalize($data, $type, $format);
        $object->setOwner($this->security->getUser());
        return $object;
    }
}
