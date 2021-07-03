<?php

namespace App\Entity;

use App\Repository\InvoiceServiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: InvoiceServiceRepository::class)]
#[ORM\Table(name: "invoices_services")]
class InvoiceService
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(['invoices:read', 'users_customers_subresource', 'customers_invoices_subresource', 'allInvoices:read'])]
    private int $id;

    #[ORM\Column(type: "string", length: 60)]
    #[Groups([
        'invoices:read',
        'invoices:write',
        'invoice:update',
        'users_customers_subresource',
        'customers_invoices_subresource',
        'allInvoices:read',
    ])]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 60)]
    private string $name;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups([
        'invoices:read',
        'invoices:write',
        'invoice:update',
        'users_customers_subresource',
        'customers_invoices_subresource',
        'allInvoices:read',
    ])]
    #[Assert\NotBlank(allowNull: true)]
    private ?string $description = null;

    #[ORM\Column(type: "integer", nullable: true)]
    #[Groups([
        'invoices:read',
        'invoices:write',
        'invoice:update',
        'users_customers_subresource',
        'customers_invoices_subresource',
        'allInvoices:read',
    ])]
    #[Assert\NotBlank(allowNull: true)]
    private ?int $quantity = null;

    #[ORM\Column(type: "float")]
    #[Groups([
        'invoices:read',
        'invoices:write',
        'invoice:update',
        'users_customers_subresource',
        'customers_invoices_subresource',
        'allInvoices:read',
    ])]
    #[Assert\NotBlank]
    private float $unitPrice;

    #[ORM\ManyToOne(targetEntity: Invoice::class, inversedBy: "services")]
    #[ORM\JoinColumn(nullable: false)]
    private ?Invoice $invoice = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(?int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getUnitPrice(): ?float
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(float $unitPrice): self
    {
        $this->unitPrice = $unitPrice;

        return $this;
    }

    public function getInvoice(): ?Invoice
    {
        return $this->invoice;
    }

    public function setInvoice(?Invoice $invoice): self
    {
        $this->invoice = $invoice;

        return $this;
    }
}
