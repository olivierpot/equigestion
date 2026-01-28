# Application de Gestion de Pension de Chevaux

Application web moderne de gestion de pension de chevaux développée avec Next.js, TypeScript, Prisma, et PostgreSQL.

## 🚀 Stack Technique

- **Framework:** Next.js 15 (App Router)
- **Langage:** TypeScript 5+
- **Base de données:** PostgreSQL + Prisma ORM
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Formulaires:** React Hook Form

## 📋 Prérequis

- Node.js 20+
- Docker & Docker Compose (pour la base de données locale)

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd equigestion
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
```

4. **Lancer PostgreSQL avec Docker**
```bash
docker-compose up -d
```

5. **Exécuter les migrations Prisma**
```bash
npx prisma migrate dev
```

6. **Générer le client Prisma**
```bash
npx prisma generate
```

## 🏃 Développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🧪 Commandes Utiles

```bash
# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Démarrer en mode production
npm start

# Linter
npm run lint

# Formater le code
npx prettier --write .

# Ouvrir Prisma Studio (UI pour la base de données)
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name <nom_migration>
```

## 🐳 Docker

### Développement Local

```bash
# Démarrer la base de données
docker-compose up -d

# Arrêter la base de données
docker-compose down

# Supprimer les données (attention !)
docker-compose down -v
```

### Build pour Production (Cloud Run)

```bash
# Build l'image Docker
docker build -t equigestion .

# Tester localement
docker run -p 8080:8080 -e DATABASE_URL="<url>" equigestion
```

## 📁 Structure du Projet

```
equigestion/
├── src/
│   ├── app/              # Routes Next.js (App Router)
│   ├── components/       # Composants React
│   ├── lib/             # Utilitaires (db client, etc.)
│   └── types/           # Types TypeScript
├── prisma/
│   ├── schema.prisma    # Schéma de base de données
│   └── migrations/      # Migrations
├── public/              # Assets statiques
├── Dockerfile           # Configuration Docker
└── docker-compose.yml   # PostgreSQL local
```

## 🌍 Déploiement (Google Cloud Run)

Documentation à venir pour le déploiement en production.

## 📝 License

Propriétaire
