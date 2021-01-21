<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"customers:read"}},
 *  collectionOperations={"post"},
 *  itemOperations={
 *      "get"={"security"="object.getOwner() == user"},
 *      "put"={"security"="object.getOwner() == user"},
 *      "patch"={"security"="object.getOwner() == user"},
 *       "delete"={"security"="object.getOwner() == user"}
 *  },
 *  subresourceOperations={
 *      "api_users_customers_get_subresource"={"security"="object == user", "normalization_context"={"groups"={"users_customers_subresource"}}},     
 *  }
 * )
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ORM\Table(name="customers")
 * @ORM\HasLifecycleCallbacks
 * @UniqueEntity(fields={"email"}, message="This email address is already in use.")
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customers:read", "users_customers_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(min=2, max=30)
     * @Groups({"customers:read", "users_customers_subresource"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(min=2, max=30)
     * @Groups({"customers:read", "users_customers_subresource"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     * @Assert\Email
     * @Groups({"customers:read", "users_customers_subresource"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(max=30)
     * @Groups({"customers:read", "users_customers_subresource"})
     */
    private $company;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"customers:read"})
     */
    private $owner;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"customers:read", "users_customers_subresource"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"customers:read", "users_customers_subresource"})
     */
    private $updatedAt;

    public function __construct()
    {
        $this->setCreatedAt(new DateTime());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @ORM\PreUpdate
     */
    public function updateTimestamp(): void
    {
        $this->setUpdatedAt(new DateTime());
    }
}
