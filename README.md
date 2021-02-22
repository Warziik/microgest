# MicroGest
![Continuous Integration](https://github.com/Warziik/microgest/workflows/Continuous%20Integration/badge.svg?branch=master)

Tableau de bord facilitant la comptabilité de sa micro-entreprise.

## Installation (environement de développement)
Exécuter les commandes ci-dessous à la racine du projet (prérequis [Docker](https://www.docker.com/) et [Docker-compose](https://docs.docker.com/compose/install/)).
```
docker-compose up -d --build
# construit l'image php et lance les containers docker

docker exec -ti php8-container composer install
# installe les dépendances php

docker exec -ti php8-container symfony console d:d:c
# crée la base de données mysql 'microgest'

docker exec -ti php8-container symfony console d:s:c
# crée le schéma de la base de données

docker exec -ti php8-container symfony console d:f:l -n
# génère les fausses données pour les entités doctrine (optionnel)

docker-compose run --rm node-service yarn install
# installe les dépendances javascript

docker-compose run --rm node-service yarn run dev
# construit les assets

docker exec -ti php8-container php bin/phpunit
# lance les tests PHP unitaires et fonctionnels

docker-compose run --rm node-service yarn test
# lance les tests JavaScript unitaires et fonctionnels
```
N'oubliez pas de générer la clé publique et privée pour l'authentification JWT (voir [documentation officielle](https://github.com/lexik/LexikJWTAuthenticationBundle/blob/master/Resources/doc/index.md)).

## URLs de développement
* Application Symfony: `http://localhost:8080`
    * Documentation de l'API: `http://localhost:8080/api`
* PhpMyAdmin: `http://localhost:8081`
* Maildev: `http://localhost:8082`

## Trello board
Suivez l'avancement de l'application via le [projet trello](https://trello.com/b/EHAWSKCo).

## UI Web design
La maquette de l'interface web du projet en cours de création est [disponible ici](https://xd.adobe.com/view/2ec8201a-51b3-43f7-97d2-a955c6f965d2-7b9b/?fullscreen).

Créée avec [Adobe XD](https://www.adobe.com/fr/products/xd.html).

## Licence
Dépôt sous licence [MIT](https://choosealicense.com/licenses/mit/).