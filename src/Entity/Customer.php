<?php

namespace App\Entity;

use DateTime;
use DateTimeInterface;
use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ORM\Table(name="customers")
 * @ORM\HasLifecycleCallbacks
 */
#[UniqueEntity(fields: ["email"], message: "This email address is already in use.")]
#[ApiResource(
    normalizationContext: ["groups" => ["customers:read"]],
    denormalizationContext: ["groups" => ["customers:write"]],
    collectionOperations: ["post"],
    itemOperations: [
        "get" => ["security" => "object.getOwner() == user"],
        "put" => ["security" => "object.getOwner() == user"],
        "delete" => ["security" => "object.getOwner() == user"]
    ],
    subresourceOperations: [
        "api_users_customers_get_subresource" => [
            "security" => "is_granted('GET_SUBRESOURCE', _api_normalization_context['subresource_resources'])",
            "normalization_context" => ["groups" => ["users_customers_subresource"]]
        ]
    ],
)]
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(["customers:read", "users_customers_subresource"])]
    private ?int $id = null;

    /** @ORM\Column(type="string", length=255) */
    #[Groups(["customers:read", "customers:write", "users_customers_subresource"])]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 30)]
    private ?string $firstname = null;

    /** @ORM\Column(type="string", length=255) */
    #[Groups(["customers:read", "customers:write", "users_customers_subresource"])]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 30)]
    private ?string $lastname = null;

    /** @ORM\Column(type="string", length=255) */
    #[Groups(["customers:read", "customers:write", "users_customers_subresource"])]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    /** @ORM\Column(type="string", length=255, nullable=true) */
    #[Groups(["customers:read", "customers:write", "users_customers_subresource"])]
    #[Assert\Length(max: 30)]
    private ?string $company = null;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @ORM\JoinColumn(nullable=false)
     */
    #[Groups(["customers:read"])]
    #[Assert\NotBlank]
    private ?User $owner = null;

    /** @ORM\Column(type="datetime") */
    #[Groups(["customers:read", "users_customers_subresource"])]
    #[Assert\Type(DateTimeInterface::class)]
    private ?DateTimeInterface $createdAt = null;

    /** @ORM\Column(type="datetime", nullable=true) */
    #[Groups(["customers:read", "users_customers_subresource"])]
    #[Assert\Type(DateTimeInterface::class)]
    private ?DateTimeInterface $updatedAt = null;

    /** @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer", orphanRemoval=true, cascade={"persist"}) */
    #[Groups(["customers:read"])]
    #[ApiSubresource]
    private ?Collection $invoices = null;

    public function __construct()
    {
        $this->setCreatedAt(new \DateTime());
        $this->invoices = new ArrayCollection();
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

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }
}
