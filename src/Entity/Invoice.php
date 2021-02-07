<?php

namespace App\Entity;

use DateTimeInterface;
use App\Entity\Customer;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\CreateInvoice;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ORM\Table(name="invoices")
 */
#[ApiResource(
    normalizationContext: ["groups" => ["invoices:read"]],
    denormalizationContext: ["groups" => ["invoices:write"]],
    collectionOperations: ["post" => ["controller" => CreateInvoice::class]],
    itemOperations: [
        "get" => ["security" => "object.getCustomer().getOwner() == user"],
        "put" => ["security" => "object.getCustomer().getOwner() == user", "denormalization_context" => ["groups" => ["invoice:update"]]],
        "delete" => ["security" => "object.getCustomer().getOwner() == user"]
    ],
    subresourceOperations: [
        "api_customers_invoices_get_subresource" => [
            "security" => "is_granted('GET_SUBRESOURCE', _api_normalization_context['subresource_resources'])",
            "normalization_context" => ["groups" => ["customers_invoices_subresource"]]
        ]
    ]
)]
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(["invoices:read", "customers_invoices_subresource"])]
    private ?int $id = null;

    /** @ORM\Column(type="float") */
    #[Groups(["invoices:read", "invoices:write", "invoice:update", "customers_invoices_subresource"])]
    #[Assert\NotBlank()]
    #[Assert\Type(type: "numeric", message: "The amount must be a number.")]
    private ?float $amount = null;
    
    /** @ORM\Column(type="string", length=255) */
    #[Groups(["invoices:read", "invoices:write", "invoice:update", "customers_invoices_subresource"])]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ["NEW", "SENT", "PAID", "CANCELLED"], message: "The status must be of type 'NEW', 'SENT', 'PAID' or 'CANCELLED' only.")]
    private ?string $status = null;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     */
    #[Groups(["invoices:read", "invoices:write"])]
    #[Assert\NotBlank]
    private ?Customer $customer = null;

    /** @ORM\Column(type="datetime", nullable=true) */
    #[Groups(["invoices:read", "invoices:write", "invoice:update", "customers_invoices_subresource"])]
    #[Assert\Type(DateTimeInterface::class)]
    private ?DateTimeInterface $sentAt = null;

    /** @ORM\Column(type="datetime", nullable=true) */
    #[Groups(["invoices:read", "invoices:write", "invoice:update", "customers_invoices_subresource"])]
    #[Assert\Type(DateTimeInterface::class)]
    private ?DateTimeInterface $paidAt = null;

    /** @ORM\Column(type="string", length=255) */
    #[Groups(["invoices:read", "customers_invoices_subresource"])]
    private ?string $chrono = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus($status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getSentAt(): ?DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(?DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getPaidAt(): ?DateTimeInterface
    {
        return $this->paidAt;
    }

    public function setPaidAt(?DateTimeInterface $paidAt): self
    {
        $this->paidAt = $paidAt;

        return $this;
    }

    public function getChrono(): ?string
    {
        return $this->chrono;
    }

    public function setChrono(string $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
