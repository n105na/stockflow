#  StockFlow — API de Gestion de Stock

##  Contexte du projet

Ce projet a été réalisé dans le cadre de la SAE *“Développement & Déploiement d’une Application Web RESTful Conteneurisée”*.

L’objectif est de concevoir une API permettant de gérer un système de stock (produits, fournisseurs, mouvements de stock) en respectant les bonnes pratiques :

* API REST (GET, POST, PATCH, DELETE)
* Base de données relationnelle
* Utilisation d’un ORM
* Architecture propre (modulaire)
* Authentification sécurisée

---

##  Problème traité

Dans un système réel, la gestion du stock nécessite :

* suivre les produits
* gérer les fournisseurs
* tracer les entrées/sorties
* éviter les incohérences (stock négatif)

 Cette API répond à ces besoins avec un système structuré et traçable.

---

##  Technologies utilisées

### Backend

* Django
* Django REST Framework
* JWT (authentification)
* ORM Django

### Base de données

* PostgreSQL

---

##  Modélisation des données

### Relations implémentées

* **One-to-Many**

  * Category → Product
  * Product → StockMovement

* **Many-to-Many**

  * Product ↔ Supplier

* **One-to-One**

  * Product → ProductDetails

---

##  Fonctionnalités principales

* CRUD Produits
* CRUD Catégories
* CRUD Fournisseurs
* Gestion du stock (entrée / sortie)
* Historique des mouvements
* Validation métier (pas de stock négatif)
* Authentification JWT
* API sécurisée

---

##  Installation du projet (Backend)

### 1. Cloner le projet

```bash
git clone https://github.com/TON_USERNAME/stockflow.git
cd stockflow/backend
```

---

### 2. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate
```

---

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

---

##  Configuration PostgreSQL

### 1. Installer PostgreSQL (Linux)

```bash
sudo pacman -S postgresql
```

---

### 2. Créer la base de données

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE stockflow;
CREATE USER stockuser WITH PASSWORD 'stockpass';
GRANT ALL PRIVILEGES ON DATABASE stockflow TO stockuser;
```

---

### 3. Donner les permissions (IMPORTANT)

```sql
\c stockflow
GRANT ALL ON SCHEMA public TO stockuser;
ALTER SCHEMA public OWNER TO stockuser;
```

---

### 4. Configurer Django (`settings.py`)

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "stockflow",
        "USER": "stockuser",
        "PASSWORD": "stockpass",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

---

##  Lancer le projet

### Appliquer les migrations

```bash
python manage.py migrate
```

---

### Créer un super utilisateur

```bash
python manage.py createsuperuser
```

---

### Lancer le serveur

```bash
python manage.py runserver
```

---

##  Authentification

### Endpoint login

```bash
POST /api/auth/login/
```

Body JSON :

```json
{
  "username": "admin",
  "password": "password"
}
```

 Retourne un token JWT

---

##  Endpoints API

| Méthode | Endpoint                |
| ------- | ----------------------- |
| GET     | /api/products/          |
| POST    | /api/products/          |
| GET     | /api/categories/        |
| GET     | /api/suppliers/         |
| POST    | /api/stock-movements/   |
| GET     | /api/dashboard/summary/ |

---

##  Logique métier importante

Le stock n’est **pas modifié directement**.

👉 Il est géré via les mouvements :

* IN → augmente le stock
* OUT → diminue le stock
* Vérification → empêche stock négatif

---

##  Problèmes rencontrés

### 1. Base de données inexistante

Erreur :

```
database does not exist
```

✔ Solution : création manuelle avec PostgreSQL

---

### 2. Problème de collation (Arch Linux)

✔ Solution : réinitialisation ou refresh du cluster PostgreSQL

---

### 3. Permissions PostgreSQL

Erreur :

```
permission denied for schema public
```

✔ Solution :

```sql
GRANT ALL ON SCHEMA public TO stockuser;
```

---

##  Résultat final

* API REST fonctionnelle
* Base de données PostgreSQL
* Authentification sécurisée
* Architecture propre et modulaire
* Prêt pour Docker et déploiement

---

##  Auteur

Projet réalisé dans le cadre de la SAE DDAW
Étudiant : *BENIAINI Amina*

---
