<?php

namespace App\Entity;

use App\Repository\JwtRefreshTokenRepository;
use Doctrine\ORM\Mapping as ORM;
use Gesdinet\JWTRefreshTokenBundle\Entity\AbstractRefreshToken;

#[ORM\Entity(repositoryClass: JwtRefreshTokenRepository::class)]
#[ORM\Table(name: "jwt_refresh_tokens")]
class JwtRefreshToken extends AbstractRefreshToken
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
