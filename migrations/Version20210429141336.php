<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210429141336 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE customers ADD type VARCHAR(7) NOT NULL, ADD phone VARCHAR(30) DEFAULT NULL, ADD siret BIGINT DEFAULT NULL, ADD address VARCHAR(255) NOT NULL, ADD postal_code INT NOT NULL, ADD city VARCHAR(255) NOT NULL, ADD country VARCHAR(3) NOT NULL, CHANGE firstname firstname VARCHAR(30) DEFAULT NULL, CHANGE lastname lastname VARCHAR(30) DEFAULT NULL, CHANGE company company VARCHAR(40) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE customers DROP type, DROP phone, DROP siret, DROP address, DROP postal_code, DROP city, DROP country, CHANGE firstname firstname VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE company company VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
