# COBUS V2 - Votre Portail d'Assurance Digital

![Next.js Logo](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![React Logo](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript Logo](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js Logo](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

---

## Table des matières

1.  [À Propos du Projet](#1-à-propos-du-projet)
2.  [Fonctionnalités Clés](#2-fonctionnalités-clés)
    - [Pour les Groupes](#pour-les-groupes)
    - [Pour les Personnes Physiques](#pour-les-personnes-physiques)
3.  [Technologies Utilisées](#3-technologies-utilisées)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Base de Données](#base-de-données)
    - [Déploiement](#déploiement)
4.  [Démarrage Rapide](#4-démarrage-rapide)
    - [Pré-requis](#pré-requis)
    - [Installation](#installation)
    - [Configuration des Variables d'Environnement](#configuration-des-variables-denvironnement)
    - [Lancement de l'Application](#lancement-de-lapplication)
5.  [Structure du Projet](#5-structure-du-projet)
6.  [Endpoints API](#6-endpoints-api)
7.  [Schéma de la Base de Données](#7-schéma-de-la-base-de-données)
8.  [Guides de Contribution](#8-guides-de-contribution)
9.  [Licence](#9-licence)
10. [Contact](#10-contact)

---

## 1. À Propos du Projet

COBUS V2 est une application web Fullstack développée avec Next.js, conçue pour digitaliser et simplifier la gestion des conventions et contrats d'assurance. Elle offre un portail sécurisé et intuitif permettant aux groupes (entreprises) de consulter les conventions souscrites pour leurs employés, et aux personnes physiques (individus) de gérer leurs contrats personnels, suivre leurs cotisations, effectuer des paiements, et déclarer des sinistres.

Cette plateforme vise à améliorer l'expérience client en offrant un accès rapide et transparent à l'information et aux services d'assurance.

---

## 2. Fonctionnalités Clés

### Pour les Groupes

- **Consultation des Conventions :** Accès aux détails des conventions d'assurance souscrites pour les employés.
- **Visualisation des Contrats Employés :** Aperçu des contrats d'assurance individuels liés à la convention du groupe.
- **Gestion des Adhérents (potentiel) :** Possibilité de lister et gérer les employés souscrits (En cours).

### Pour les Personnes Physiques

- **Consultation Détaillée des Contrats :** Accès à toutes les informations de leurs contrats d'assurance personnels.
- **Suivi des Cotisations :** Historique détaillé des cotisations, montants dus et payés.
- **Impression des Documents :** Génération et impression de l'avis de situation, des quittances, etc.
- **Paiement de Quittances :** Fonctionnalité de paiement en ligne pour les primes d'assurance.
- **Rachat de Quittances :** Processus pour le rachat de certaines quittances.
- **Avis de Situation :** Génération d'un document récapitulatif de la situation du contrat à une date donnée.
- **Déclaration de Sinistre :** Un formulaire pour initier une déclaration de sinistre en ligne.
- **Autres fonctionnalités :**
  - Ex: Mises à jour des informations personnelles.
  - Ex: Accès aux documents contractuels.

---

## 3. Technologies Utilisées

Ce projet s'appuie sur un stack technologique moderne pour assurer performance, scalabilité et maintenabilité.

### Frontend

- **Next.js (vX.X.X) :** Cadre React pour des applications web hybrides (SSR, SSG, ISR, Client Components, Server Components).
- **React (vX.X.X) :** Bibliothèque JavaScript pour la construction d'interfaces utilisateur.
- **TypeScript (vX.X.X) :** Sur-ensemble typé de JavaScript pour une meilleure robustesse du code.
- **Tailwind CSS (vX.X.X) :** Framework CSS utilitaire pour un stylisation rapide et personnalisable.
- **Shadcn/ui (vX.X.X) :** (Si utilisé) Composants UI réutilisables basés sur Tailwind CSS et Radix UI.
- **React Context API :** Pour la gestion de l'état global.
- **React Query :**Pour la gestion du cache et le fetching de données côté client.

### Backend

- **Next.js API Routes :** Pour la logique backend intégrée au projet Next.js.
- **Node.js (vX.X.X) :** Environnement d'exécution JavaScript côté serveur.
<!-- * **Prisma (vX.X.X) / TypeORM / Sequelize :** (Spécifier votre ORM/ODM) Pour l'interaction avec la base de données. -->
- **Zod :** Pour la validation des schémas de données (entrées API).
- **NextAuth.js :** Pour l'authentification et l'autorisation.

### Base de Données

- **SQL Server :** Base de données principale pour stocker les informations des utilisateurs, contrats, cotisations, etc.

### Déploiement

- **Docker :** Pour la conteneurisation de l'application et de ses services.

---

## 4. Démarrage Rapide

Suivez ces instructions pour installer et lancer une copie locale de votre projet à des fins de développement et de test.

### Pré-requis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (recommandé v18.x ou supérieur)
- [npm](https://www.npmjs.com/get-npm) (recommandé v8.x ou supérieur) ou [Yarn](https://yarnpkg.com/getting-started/install) (recommandé v1.x ou supérieur)
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (si vous utilisez Docker pour la base de données ou le backend)

### Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone [https://github.com/devolutionafrica/SHAP-SHAP-CORPORATE](https://github.com/devolutionafrica/SHAP-SHAP-CORPORATE)
    cd cobus-v2
    ```
2.  **Installer les dépendances frontend et backend :**
    ```bash
    npm install  # ou yarn
    ```

### Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet et remplissez-le avec les variables d'environnement nécessaires. Un fichier `.env.example` peut être fourni pour référence.

```env
# .env.local (Exemple)

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
# Ou
# MONGODB_URI="mongodb://localhost:27017/cobus_v2"

# Authentification NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre_secret_fort_ici" # Générer une chaîne aléatoire longue

# Clés API externes (si utilisées)
# MA_CLE_API_EXTERNAL="xyz123"

# Variables spécifiques au backend (si backend séparé)
# BACKEND_PORT=5000
# JWT_SECRET="un_autre_secret_fort"
```
