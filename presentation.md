# StockFlow — Présentation du Projet SAE

## Contexte du projet

Ce projet a été réalisé dans le cadre de la SAE :

**“Développement & Déploiement d’une Application Web RESTful Conteneurisée”**

L’objectif était de développer une application complète de gestion de stock en respectant plusieurs contraintes techniques :

* API REST
* Base de données relationnelle
* Utilisation d’un ORM
* Relations entre entités
* Docker & Docker Compose
* Déploiement cloud

---

# Objectif de l’application

Dans une entreprise, la gestion du stock nécessite plusieurs fonctionnalités importantes :

* suivre les produits
* gérer les fournisseurs
* tracer les entrées et sorties
* éviter les erreurs de stock
* conserver un historique

L’objectif de StockFlow est donc de proposer une solution centralisée et structurée pour gérer un stock de manière fiable.

---

# Technologies utilisées

## Backend

### Django

Framework Python utilisé pour développer le backend.

Pourquoi Django ?

* architecture propre
* ORM intégré
* sécurité intégrée
* développement rapide

---

### Django REST Framework

Utilisé pour créer l’API REST.

Il permet :

* création des endpoints API
* sérialisation des données
* gestion des requêtes HTTP
* intégration simple avec React

---

### JWT Authentication

Utilisé pour sécuriser l’API.

Fonctionnement :

* login utilisateur
* génération d’un token JWT
* authentification des requêtes API

---

## Frontend

### React

Bibliothèque JavaScript utilisée pour créer l’interface utilisateur.

Pourquoi React ?

* interface dynamique
* composants réutilisables
* bonne séparation des pages

---

### Vite

Outil utilisé avec React.

Rôle :

* démarrage rapide du frontend
* hot reload
* build optimisé

---

### Tailwind CSS

Framework CSS utilitaire utilisé pour le design.

Avantages :

* développement rapide
* design moderne
* moins de CSS personnalisé

Exemple :

```html
className="bg-blue-500 p-4 rounded"
```

---

## Base de données

### PostgreSQL

Base de données relationnelle utilisée pour stocker les données.

Pourquoi PostgreSQL ?

* robuste
* adaptée aux relations complexes
* très utilisée en production

---

# Architecture du projet

Le projet est organisé en 3 parties :

```text
stockflow/
├── backend/
├── frontend/
├── docker-compose.yml
└── .env
```

---

# Architecture Backend

Le backend Django contient :

* Models
* Serializers
* Views
* Routes API
* Authentification JWT

Le backend gère :

* la logique métier
* les validations
* la communication avec PostgreSQL

---

# Architecture Frontend

Le frontend React contient plusieurs pages :

* Dashboard
* Produits
* Catégories
* Fournisseurs
* Historique des mouvements
* Login

Le frontend communique avec l’API grâce à Axios.

---

# Modélisation des données

## Relations implémentées

### One-to-Many

* Category → Product
* Product → StockMovement

Exemple :
une catégorie peut contenir plusieurs produits.

---

### Many-to-Many

* Product ↔ Supplier

Exemple :
un produit peut avoir plusieurs fournisseurs et un fournisseur peut fournir plusieurs produits.

---

### One-to-One

* Product → ProductDetails

Exemple :
un produit possède une seule fiche détaillée.

---

# Fonctionnalités principales

## Gestion des produits

* ajout
* modification
* suppression

---

## Gestion des fournisseurs

Relation Many-to-Many avec les produits.

---

## Gestion du stock

Les mouvements de stock utilisent :

* IN → entrée
* OUT → sortie

Le stock est automatiquement recalculé.

---

## Validation métier

Le système empêche :

* les stocks négatifs
* les incohérences de quantité

---

## Dashboard

Le dashboard affiche :

* nombre total de produits
* stock bas
* catégories
* fournisseurs
* mouvements récents

---

# Logique métier importante

Le stock n’est pas modifié directement.

Le système utilise les mouvements :

* IN → augmente le stock
* OUT → diminue le stock

Cela permet :

* traçabilité
* historique complet
* sécurité des données

---

# Dockerisation

Le projet a été entièrement conteneurisé avec Docker.

---

## Docker Compose

Le fichier `docker-compose.yml` lance 3 services :

* db
* backend
* frontend

Commande utilisée :

```bash
docker compose up --build
```

---

# Persistance des données

Un volume Docker est utilisé :

```yaml
pgdata:/var/lib/postgresql/data
```

Ce volume permet de conserver les données PostgreSQL même après l’arrêt des conteneurs.

---

# Déploiement cloud

Le projet a été déployé sur Render.

Services déployés :

* frontend React
* backend Django
* base PostgreSQL

---

# URLs du projet

## Frontend

```text
https://stockflow-1-1kj3.onrender.com/
```

## Backend API

```text
https://stockflow-q7ro.onrender.com/api
```

---

# Docker Hub

Une image Docker du backend a été publiée sur Docker Hub.

Lien :

```text
https://hub.docker.com/r/n105na/stockflow-api
```

---

## Télécharger l’image

```bash
docker pull n105na/stockflow-api
```

---

## Lancer le backend avec Docker

```bash
docker run -p 8000:8000 n105na/stockflow-api
```

---

# Commandes Docker importantes

## Lancer les conteneurs

```bash
docker compose up --build
```

## Arrêter les conteneurs

```bash
docker compose down
```

## Voir les logs

```bash
docker compose logs
```

## Voir les conteneurs actifs

```bash
docker ps
```

---

# Difficultés rencontrées

## CORS

Le frontend et le backend étant sur deux domaines différents, il fallait autoriser les requêtes cross-origin.

Configuration utilisée :

* `CORS_ALLOWED_ORIGINS`

---

## ALLOWED_HOSTS

Django bloquait les requêtes venant du domaine Render.

Solution :

* ajout du domaine Render dans `ALLOWED_HOSTS`

---

## PostgreSQL

Problèmes rencontrés :

* permissions
* création de base
* connexion Docker

---

# Résultat final

Le projet final contient :

* API REST complète
* Frontend React fonctionnel
* Authentification JWT
* Base PostgreSQL persistante
* Dockerisation complète
* Déploiement Render
* Image Docker publiée

---

# Démonstration

Pendant la démonstration :

* Login
* Dashboard
* Création produit
* Mouvement de stock
* Relations produit/fournisseur
* Historique des mouvements

---

# Auteur



**Étudiant : BENIAINI Amina**

---

# MERCI