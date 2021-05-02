<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210501195945 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE invoice_service (id INT AUTO_INCREMENT NOT NULL, invoice_id INT NOT NULL, name VARCHAR(60) NOT NULL, description VARCHAR(255) DEFAULT NULL, quantity INT DEFAULT NULL, unit_price DOUBLE PRECISION NOT NULL, INDEX IDX_1344AC012989F1FD (invoice_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE invoice_service ADD CONSTRAINT FK_1344AC012989F1FD FOREIGN KEY (invoice_id) REFERENCES invoices (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE invoice_service');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
