#  StockFlow — API de Gestion de Stock

##  Contexte du projet

Ce projet a été réalisé dans le cadre de la SAE *“Développement & Déploiement d’une Application Web RESTful Conteneurisée”*.

L’objectif est de concevoir une application complète permettant de gérer un système de stock, tout en respectant les bonnes pratiques :

* API REST (GET, POST, PATCH, DELETE)
* Base de données relationnelle
* Utilisation d’un ORM
* Architecture modulaire
* Authentification sécurisée
* Conteneurisation avec Docker

---

##  Problème traité

Dans un contexte réel, la gestion de stock nécessite :

* suivre les produits
* gérer les fournisseurs
* tracer les entrées/sorties
* éviter les incohérences (ex : stock négatif)

 Cette API répond à ces besoins avec un système structuré, fiable et traçable.

---

##  Technologies utilisées

### Backend

* Django
* Django REST Framework
* JWT (authentification)
* ORM Django

### Frontend

* React (Vite)
* Tailwind CSS

### Base de données

* PostgreSQL

---

##  Lancement avec Docker (Recommandé)

### 1. Cloner le projet

```bash
git clone https://github.com/TON_USERNAME/stockflow.git
cd stockflow
```

### 2. Lancer l’application

```bash
docker compose up --build
```

---

##  Accès aux services

| Service      | URL                         |
| ------------ | --------------------------- |
| Frontend     | http://localhost:5173       |
| Backend API  | http://localhost:8000/api   |
| Admin Django | http://localhost:8000/admin |

---

##  Identifiants de test

```text
username: admin
password: admin1234
```

---

##  Données de démonstration

Les données sont automatiquement créées au démarrage grâce à une commande Django personnalisée :

```bash
python manage.py seed_data
```

✔ Catégories
✔ Fournisseurs
✔ Produits
✔ Mouvements de stock

---

##  Architecture du projet

```text
stockflow/
├── backend/
│   ├── inventory/
│   ├── manage.py
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   └── Dockerfile
│
├── docker-compose.yml
└── .env
```

---

##  Architecture Docker

L’application est composée de **3 services** :

* **db** → PostgreSQL (persistance des données)
* **backend** → API Django REST
* **frontend** → Interface React

 Les services communiquent via un réseau Docker.

 Les données sont persistées grâce à un volume :

```yaml
pgdata:/var/lib/postgresql/data
```

---

##  Modélisation des données

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

---

##  Exemple de requête API

### Créer un produit

```http
POST /api/products/
```

```json
{
  "name": "Produit test",
  "sku": "TEST-001",
  "quantity": 10,
  "minimum_stock": 2,
  "price": 50,
  "category": 1,
  "supplier_ids": [1]
}
```

---

##  Authentification

### Endpoint login

```http
POST /api/auth/login/
```

```json
{
  "username": "admin",
  "password": "admin1234"
}
```

 Retourne un token JWT

---

## 🧠 Logique métier importante

Le stock n’est **pas modifié directement**.

👉 Il est géré via les mouvements :

* IN → augmente le stock
* OUT → diminue le stock
* Vérification → empêche un stock négatif

---

##  Installation locale (optionnelle)

### 1. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Configurer PostgreSQL

Dans `settings.py` :

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

### 4. Lancer le projet

```bash
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

---

##  Configuration (.env)

Un fichier `.env` est utilisé pour configurer l’environnement Docker :

```env
DB_NAME=stockflow
DB_USER=stockflow
DB_PASSWORD=stockflow
DB_HOST=db
DB_PORT=5432

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=admin1234
```

---

##  Problèmes rencontrés

### 1. Base de données inexistante

Erreur :

```
database does not exist
```

✔ Solution : création manuelle ou via Docker

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

##  Résultat final

* API REST complète
* Base PostgreSQL persistante
* Authentification sécurisée
* Architecture modulaire
* Conteneurisation Docker complète

---

##  Auteur

Projet réalisé dans le cadre de la SAE DDAW
**Étudiant : BENIAINI Amina**
