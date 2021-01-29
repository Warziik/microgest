<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InvoiceRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"invoices:read"}},
 *  collectionOperations={"post"},
 *  itemOperations={
 *      "get"={"security"="object.getCustomer().getOwner() == user"},
 *      "put"={"security"="object.getCustomer().getOwner() == user"},
 *      "delete"={"security"="object.getCustomer().getOwner() == user"}
 *  },
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={"security"="is_granted('GET_SUBRESOURCE', _api_normalization_context['subresource_resources'])", "normalization_context"={"groups"={"customers_invoices_subresource"}}}
 *  }
 * )
 * @ORM\Table(name="invoices")
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices:read", "customers_invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices:read", "customers_invoices_subresource"})
     * @Assert\NotBlank
     * @Assert\Type(type="numeric", message="The amount must be a number.")
     */
    private $amount;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices:read", "customers_invoices_subresource"})
     * @Assert\NotBlank
     * @Assert\Choice(choices={"NEW", "SENT", "PAID", "CANCELLED"}, message="The status must be of type 'NEW', 'SENT', 'PAID' or 'CANCELLED' only.")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices:read"})
     * @Assert\NotBlank
     */
    private $customer;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"invoices:read", "customers_invoices_subresource"})
     * @Assert\Type(\DateTimeInterface::class)
     */
    private $sentAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"invoices:read", "customers_invoices_subresource"})
     * @Assert\Type(\DateTimeInterface::class)
     */
    private $paidAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices:read", "customers_invoices_subresource"})
     * @Assert\Regex(pattern="/^[0-9]{4}-[0-9]{4}$/", message="{{ value }} must respect this format: YYYY-0000")
     */
    private $chrono;

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

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(?\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getPaidAt(): ?\DateTimeInterface
    {
        return $this->paidAt;
    }

    public function setPaidAt(?\DateTimeInterface $paidAt): self
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
