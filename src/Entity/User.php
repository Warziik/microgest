<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use App\Controller\ResetPassword;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\ForgotPassword;
use ApiPlatform\Core\Annotation\ApiSubresource;
use App\Controller\ConfirmAccount;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="users")
 * @ORM\HasLifecycleCallbacks
 */
#[UniqueEntity(fields: ["email"], message: "This email address is already in use.")]
#[
    ApiResource(
        normalizationContext: ["groups" => ["users:read"]],
        denormalizationContext: ["groups" => ["users:write"]],
        collectionOperations: [
            "post",
            "forgotPassword" => [
                "method" => "POST",
                "path" => "/users/forgot_password",
                "controller" => ForgotPassword::class,
                "denormalization_context" => ["groups" => ["forgotPassword:write"]]
            ],
            "resetPassword" => [
                "method" => "POST",
                "path" => "/users/reset_password",
                "controller" => ResetPassword::class,
                "denormalization_context" => ["groups" => ["resetPassword:write"]]
            ]
        ],
        itemOperations: [
            "get" => ["security" => "object == user"],
            "put" => ["security" => "object == user"],
            "delete" => ["security" => "object == user"],
            "confirmAccount" => [
                "method" => "POST",
                "path" => "/users/{id}/confirm_account",
                "controller" => ConfirmAccount::class
            ]
        ]
    )
]
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(["users:read"])]
    private ?int $id = null;

    /** @ORM\Column(type="string", length=255) */
    #[Groups(["users:read", "users:write"])]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 30)]
    private ?string $firstname = null;

    /** @ORM\Column(type="string", length=255) */
    #[Groups(["users:read", "users:write"])]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 30)]
    private ?string $lastname = null;

    /** @ORM\Column(type="string", length=255, unique=true) */
    #[Groups(["users:read", "users:write", "forgotPassword:write"])]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    /** @ORM\Column(type="string", length=255) */
    #[Groups(["users:write", "resetPassword:write"])]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 255)]
    private ?string $password = null;

    /** @ORM\Column(type="json") */
    #[Groups(["users:read"])]
    private ?array $roles = [];

    /** @ORM\Column(type="datetime") */
    #[Groups(["users:read"])]
    #[Assert\Type(DateTimeInterface::class)]
    private ?DateTimeInterface $createdAt = null;

    /** @ORM\Column(type="datetime", nullable=true) */
    #[Groups(["users:read"])]
    #[Assert\Type(DateTimeInterface::class)]
    private ?DateTimeInterface $updatedAt = null;

    /** @ORM\OneToMany(targetEntity=Customer::class, mappedBy="owner", orphanRemoval=true, cascade={"persist"}) */
    #[ApiSubResource(maxDepth: 1)]
    private ?Collection $customers = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    #[Groups(["users:read"])]
    #[Assert\Length(min: 10, max: 255)]
    private ?string $confirmationToken = null;

    /** @ORM\Column(type="datetime", nullable=true) */
    #[Groups(["users:read"])]
    #[Assert\Type(DateTimeInterface::class)]
    private ?DateTimeInterface $confirmedAt = null;

    public function __construct()
    {
        $this->customers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection|Customer[]
     */
    public function getCustomers(): Collection
    {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customers->contains($customer)) {
            $this->customers[] = $customer;
            $customer->setOwner($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customers->removeElement($customer)) {
            // set the owning side to null (unless already changed)
            if ($customer->getOwner() === $this) {
                $customer->setOwner(null);
            }
        }

        return $this;
    }

    public function getConfirmationToken(): ?string
    {
        return $this->confirmationToken;
    }

    public function setConfirmationToken(?string $confirmationToken): self
    {
        $this->confirmationToken = $confirmationToken;

        return $this;
    }

    public function getConfirmedAt(): ?\DateTimeInterface
    {
        return $this->confirmedAt;
    }

    public function setConfirmedAt(?\DateTimeInterface $confirmedAt): self
    {
        $this->confirmedAt = $confirmedAt;

        return $this;
    }

    /** @ORM\PreUpdate */
    public function updateTimestamp(): void
    {
        $this->setUpdatedAt(new DateTime());
    }

    /** @ORM\PrePersist */
    public function prePersist(): void
    {
        if ($this->getCreatedAt() === null) {
            $this->setCreatedAt(new DateTime());
        }
    }
}
