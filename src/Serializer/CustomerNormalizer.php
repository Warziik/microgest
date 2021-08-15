<?php

namespace App\Serializer;

use App\Entity\Customer;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Vich\UploaderBundle\Storage\StorageInterface;

class CustomerNormalizer implements ContextAwareNormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;


    private const ALREADY_CALLED = 'CUSTOMER_ATTRIBUTE_NORMALIZER_ALREADY_CALLED';

    public function __construct(private StorageInterface $storage)
    {
    }

    /**
     * {@inheritdoc}
     *
     * @param array $context options that normalizers have access to
     */
    public function supportsNormalization($data, string $format = null, array $context = [])
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Customer;
    }

    public function normalize($object, $format = null, array $context = [])
    {
        $object->setPictureUrl($this->storage->resolveUri($object, "pictureFile"));
        $context[self::ALREADY_CALLED] = true;
        return $this->normalizer->normalize($object, $format, $context);
    }
}
