# MicroGest
![Continuous Integration](https://github.com/Warziik/microgest/workflows/Continuous%20Integration/badge.svg?branch=master)

Tableau de bord facilitant la comptabilité de sa micro-entreprise.

## Installation (environement de développement)
Exécuter les commandes ci-dessous à la racine du projet (prérequis [Docker](https://www.docker.com/) et [Docker-compose](https://docs.docker.com/compose/install/)).
```
docker-compose build
# construit les services

docker-compose up -d
# lance les containers docker

docker exec -ti php8-container bash
# intéragit avec le container php

composer install
# installe les dépendances php

symfony console d:d:c
# crée la base de données mysql 'microgest'

symfony console d:s:c
# crée le schéma de la base de données

php bin/phpunit
# lance les tests unitaires et fonctionnels

symfony console d:f:l -n
# génère les fausses données pour les entités doctrine (optionnel)
```
N'oubliez pas de générer la clé publique et privée pour l'authentification JWT (voir [documentation officielle](https://github.com/lexik/LexikJWTAuthenticationBundle/blob/master/Resources/doc/index.md)).

## URLs de développement
* Application Symfony: `http://localhost:8080`
    * Documentation de l'API: `http://localhost:8080/api`
* PhpMyAdmin: `http://localhost:8081`
* Maildev: `http://localhost:8082`

## Trello board
Suivez l'avancement de l'application via le [projet trello](https://trello.com/b/EHAWSKCo).

## Licence
Dépôt sous licence [MIT](https://choosealicense.com/licenses/mit/).