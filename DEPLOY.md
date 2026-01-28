# Guide de Déploiement GCP - Equigestion

**Projet:** equigestion-prod-2026  
**Région:** europe-west9 (Paris)

---

## ⚠️ Prérequis : Activer la Facturation

Avant tout, votre projet doit avoir un compte de facturation actif.

**Vérifier :**
```bash
gcloud beta billing projects describe equigestion-prod-2026
```

**Si pas de compte de facturation :**
1. Allez sur https://console.cloud.google.com/billing
2. Créez un compte de facturation (carte bancaire requise)
3. Associez-le au projet `equigestion-prod-2026`

💡 **Nouveau compte ?** Vous avez **300$ gratuits pendant 90 jours** !

---

## 📋 Étape 1 : Configuration du Projet

```bash
# Définir le projet et la région
gcloud config set project equigestion-prod-2026
gcloud config set run/region europe-west9

# Activer les APIs nécessaires (prend ~2 minutes)
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com
```

**Attendez que toutes les APIs soient activées avant de continuer.**

---

## 🗄️ Étape 2 : Créer Cloud SQL (PostgreSQL)

Cette étape crée votre base de données PostgreSQL gérée (~7€/mois, **gratuit avec crédit**).

```bash
# IMPORTANT: Choisissez un mot de passe fort et notez-le !
gcloud sql instances create equigestion-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=europe-west9 \
  --root-password=VOTRE_MOT_DE_PASSE_FORT_ICI \
  --storage-type=HDD \
  --storage-size=10GB \
  --backup-start-time=03:00
```

⏱️ **Temps d'attente : ~5-10 minutes**

**Vérifier que l'instance est prête :**
```bash
gcloud sql instances describe equigestion-db --format='value(state)'
# Attendez que ça affiche: RUNNABLE
```

---

## 📊 Étape 3 : Créer la Base de Données et l'Utilisateur

```bash
# Créer la base de données
gcloud sql databases create equigestion \
  --instance=equigestion-db

# Créer l'utilisateur applicatif (choisissez un autre mot de passe)
gcloud sql users create appuser \
  --instance=equigestion-db \
  --password=CHOISIR_MOT_DE_PASSE_APP
```

**💾 Notez bien ces informations :**
- Root password: [celui choisi à l'étape 2]
- App password: [celui choisi maintenant]

---

## 🔐 Étape 4 : Récupérer le Connection Name

```bash
CONNECTION_NAME=$(gcloud sql instances describe equigestion-db --format='value(connectionName)')
echo "Connection Name: $CONNECTION_NAME"
```

**Devrait afficher :** `equigestion-prod-2026:europe-west9:equigestion-db`

**💾 Copiez cette valeur, vous en aurez besoin.**

---

## 🔑 Étape 5 : Configurer Secret Manager

Stocker l'URL de connexion de manière sécurisée.

```bash
# Construire l'URL (remplacez [MOT_DE_PASSE_APP] par le vrai)
DATABASE_URL="postgresql://appuser:[MOT_DE_PASSE_APP]@/equigestion?host=/cloudsql/$CONNECTION_NAME&sslmode=disable"

# Créer le secret
echo -n "$DATABASE_URL" | gcloud secrets create database-url --data-file=-
```

**Donner accès au service Cloud Run :**
```bash
PROJECT_NUMBER=$(gcloud projects describe equigestion-prod-2026 --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role='roles/secretmanager.secretAccessor'
```

---

## 📦 Étape 6 : Setup Artifact Registry

Créer le repository pour stocker vos images Docker.

```bash
gcloud artifacts repositories create equigestion-repo \
  --repository-format=docker \
  --location=europe-west9 \
  --description="Docker images for Equigestion"

# Configurer Docker
gcloud auth configure-docker europe-west9-docker.pkg.dev
```

---

## 🐳 Étape 7 : Build et Push de l'Image Docker

```bash
# Définir le nom de l'image
IMAGE_NAME="europe-west9-docker.pkg.dev/equigestion-prod-2026/equigestion-repo/equigestion:latest"

# Build l'image (depuis le dossier du projet)
docker build -t $IMAGE_NAME .

# Push vers Artifact Registry
docker push $IMAGE_NAME
```

⏱️ **Temps : ~3-5 minutes**

---

## 🚀 Étape 8 : Déployer sur Cloud Run

```bash
gcloud run deploy equigestion \
  --image=$IMAGE_NAME \
  --region=europe-west9 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --add-cloudsql-instances=$CONNECTION_NAME \
  --set-secrets=DATABASE_URL=database-url:latest \
  --set-env-vars="NODE_ENV=production"
```

**Récupérer l'URL de votre application :**
```bash
gcloud run services describe equigestion \
  --region=europe-west9 \
  --format='value(status.url)'
```

🎉 **Votre app est en ligne !**

---

## 🔄 Étape 9 : Exécuter les Migrations Prisma

**Option A : Via Cloud Shell (Plus Simple)**

```bash
# Installer cloud-sql-proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.2/cloud-sql-proxy.darwin.amd64
chmod +x cloud-sql-proxy

# Démarrer le proxy (dans un terminal séparé)
./cloud-sql-proxy $CONNECTION_NAME

# Dans votre terminal principal (dans le dossier du projet)
export DATABASE_URL="postgresql://appuser:[MOT_DE_PASSE]@localhost:5432/equigestion"
npx prisma migrate deploy
```

**Option B : Via Cloud Run Job**

```bash
gcloud run jobs create equigestion-migrate \
  --image=$IMAGE_NAME \
  --region=europe-west9 \
  --add-cloudsql-instances=$CONNECTION_NAME \
  --set-secrets=DATABASE_URL=database-url:latest \
  --command="npx" \
  --args="prisma,migrate,deploy"

# Exécuter la migration
gcloud run jobs execute equigestion-migrate --region=europe-west9 --wait
```

---

## ✅ Étape 10 : Vérification

```bash
# 1. Tester l'URL
APP_URL=$(gcloud run services describe equigestion --region=europe-west9 --format='value(status.url)')
curl -I $APP_URL
# Attendu: HTTP/2 200

# 2. Voir les logs
gcloud run services logs read equigestion --region=europe-west9 --limit=20

# 3. Ouvrir dans le navigateur
open $APP_URL
```

---

## 🎯 Résumé des Commandes Rapides

**Redéployer après modifications :**
```bash
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME
gcloud run deploy equigestion --image=$IMAGE_NAME --region=europe-west9
```

**Voir les logs :**
```bash
gcloud run services logs tail equigestion --region=europe-west9
```

**Mettre à jour une variable d'environnement :**
```bash
gcloud run services update equigestion \
  --region=europe-west9 \
  --set-env-vars="NEW_VAR=value"
```

---

## 💰 Coûts Réels

Avec cette configuration :
- **Cloud Run** : ~0-3€/mois (scale to zero)
- **Cloud SQL** : ~7-9€/mois
- **Artifact Registry** : ~0.5€/mois
- **TOTAL** : **~8-13€/mois**

💡 Avec 300$ de crédit = **gratuit pendant ~23 mois**

---

## 🆘 Dépannage

**Erreur "billing not enabled" :**
- Activez la facturation : https://console.cloud.google.com/billing

**Erreur "API not enabled" :**
- Relancez l'étape 1

**Cloud SQL pas accessible :**
- Vérifiez que `$CONNECTION_NAME` est correct
- Vérifiez que Cloud SQL est `RUNNABLE`

**Image Docker trop grosse :**
- C'est normal (~200-300MB), l'image est optimisée

---

## 📚 Ressources

- Console GCP : https://console.cloud.google.com
- Cloud Run : https://console.cloud.google.com/run
- Cloud SQL : https://console.cloud.google.com/sql
- Logs : https://console.cloud.google.com/logs
