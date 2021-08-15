<?php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Devis;
use App\Entity\Invoice;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

final class CurrentUserExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private Security $security)
    {
    }

    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ) {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    /**
     * @param QueryBuilder $queryBuilder
     * @param string $resourceClass
     */
    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        $user = $this->security->getUser();
        if (!$user || !in_array($resourceClass, [Customer::class, Invoice::class, Devis::class])) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        if ($resourceClass === Customer::class) {
            $queryBuilder->andWhere(sprintf('%s.owner = :current_user', $rootAlias));
        } else {
            $queryBuilder
                ->join(sprintf('%s.customer', $rootAlias), 'c')
                ->andWhere('c.owner = :current_user');
        }
        $queryBuilder->setParameter('current_user', $user->getId());
    }
}
