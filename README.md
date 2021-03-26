# MicroGest
[![CI](https://github.com/Warziik/microgest/actions/workflows/ci.yml/badge.svg)](https://github.com/Warziik/microgest/actions/workflows/ci.yml)

Tableau de bord facilitant la gestion des clients et des factures de sa micro-entreprise. 

## Installation (environement de développement)
Exécuter les commandes ci-dessous à la racine du projet (prérequis [Docker](https://www.docker.com/) et [Docker-compose](https://docs.docker.com/compose/install/)).
```
make install
# installe les dépendances PHP et JavaScript

make db
# crée la base de données et exécute les migrations

make fixtures
# génère les fausses données pour les entités doctrine (optionnel)

make jwt-keys
# génère la clé publique et privée pour l'authentification JWT

make assets
# construit les assets javascript

make test
# lance les tests unitaires et fonctionnels
```

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