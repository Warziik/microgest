<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210705182013 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE devis (id INT AUTO_INCREMENT NOT NULL, customer_id INT NOT NULL, chrono VARCHAR(13) NOT NULL, status VARCHAR(10) NOT NULL, validity_date DATETIME NOT NULL, created_at DATETIME NOT NULL, work_start_date DATETIME NOT NULL, work_duration VARCHAR(50) NOT NULL, payment_deadline DATETIME NOT NULL, payment_delay_rate INT DEFAULT NULL, tva_applicable TINYINT(1) NOT NULL, sent_at DATETIME DEFAULT NULL, signed_at DATETIME DEFAULT NULL, INDEX IDX_8B27C52B9395C3F3 (customer_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE devis ADD CONSTRAINT FK_8B27C52B9395C3F3 FOREIGN KEY (customer_id) REFERENCES customers (id)');
        $this->addSql('ALTER TABLE invoices CHANGE chrono chrono VARCHAR(13) NOT NULL');
        $this->addSql('ALTER TABLE invoices_services ADD devis_id INT DEFAULT NULL, CHANGE invoice_id invoice_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE invoices_services ADD CONSTRAINT FK_6D3CB6CB41DEFADA FOREIGN KEY (devis_id) REFERENCES devis (id)');
        $this->addSql('CREATE INDEX IDX_6D3CB6CB41DEFADA ON invoices_services (devis_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invoices_services DROP FOREIGN KEY FK_6D3CB6CB41DEFADA');
        $this->addSql('DROP TABLE devis');
        $this->addSql('ALTER TABLE invoices CHANGE chrono chrono VARCHAR(11) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('DROP INDEX IDX_6D3CB6CB41DEFADA ON invoices_services');
        $this->addSql('ALTER TABLE invoices_services DROP devis_id, CHANGE invoice_id invoice_id INT NOT NULL');
    }
}
