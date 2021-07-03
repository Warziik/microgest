<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210501190928 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE users ADD phone VARCHAR(255) DEFAULT NULL, ADD business_name VARCHAR(40) DEFAULT NULL, ADD siret BIGINT NOT NULL, ADD tva_number VARCHAR(13) DEFAULT NULL, ADD address VARCHAR(255) NOT NULL, ADD city VARCHAR(255) NOT NULL, ADD postal_code INT NOT NULL, ADD country VARCHAR(3) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE users DROP phone, DROP business_name, DROP siret, DROP tva_number, DROP address, DROP city, DROP postal_code, DROP country');
    }
}
