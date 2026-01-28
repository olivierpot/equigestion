#!/bin/bash
# Script de déploiement automatique - Equigestion sur GCP
# Usage: ./scripts/deploy.sh

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="equigestion-prod-2026"
REGION="europe-west9"
DB_INSTANCE_NAME="equigestion-db"
DB_NAME="equigestion"
DB_USER="appuser"
SERVICE_NAME="equigestion"
REPO_NAME="equigestion-repo"

echo -e "${BLUE}🚀 Déploiement Equigestion sur Google Cloud${NC}"
echo "============================================"
echo ""

# Étape 1: Configuration du projet
echo -e "${GREEN}📋 Étape 1/9 - Configuration du projet${NC}"
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION
echo "✅ Projet et région configurés"
echo ""

# Étape 2: Activation des APIs
echo -e "${GREEN}🔌 Étape 2/9 - Activation des APIs (peut prendre 2-3 minutes)${NC}"
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com

echo "✅ APIs activées"
echo ""

# Étape 3: Vérifier si Cloud SQL existe déjà
echo -e "${GREEN}🗄️  Étape 3/9 - Configuration Cloud SQL${NC}"
if gcloud sql instances describe $DB_INSTANCE_NAME 2>/dev/null; then
  echo "⚠️  Cloud SQL existe déjà, on passe à l'étape suivante"
else
  echo "Création de Cloud SQL (prend 5-10 minutes)..."
  echo -e "${YELLOW}⚠️  IMPORTANT: Choisissez un mot de passe ROOT fort${NC}"
  read -sp "Mot de passe ROOT Cloud SQL: " ROOT_PASSWORD
  echo ""
  
  gcloud sql instances create $DB_INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --root-password="$ROOT_PASSWORD" \
    --storage-type=HDD \
    --storage-size=10GB \
    --backup-start-time=03:00
  
  echo "✅ Instance Cloud SQL créée"
fi
echo ""

# Attendre que l'instance soit prête
echo "Vérification de l'état de Cloud SQL..."
while [ "$(gcloud sql instances describe $DB_INSTANCE_NAME --format='value(state)')" != "RUNNABLE" ]; do
  echo "En attente..."
  sleep 5
done
echo "✅ Cloud SQL est opérationnel"
echo ""

# Étape 4: Créer la base de données
echo -e "${GREEN}📊 Étape 4/9 - Création de la base de données${NC}"
if gcloud sql databases describe $DB_NAME --instance=$DB_INSTANCE_NAME 2>/dev/null; then
  echo "⚠️  Base de données existe déjà"
else
  gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE_NAME
  echo "✅ Base de données créée"
fi
echo ""

# Étape 5: Créer l'utilisateur
echo -e "${GREEN}👤 Étape 5/9 - Création de l'utilisateur applicatif${NC}"
if gcloud sql users describe $DB_USER --instance=$DB_INSTANCE_NAME 2>/dev/null; then
  echo "⚠️  Utilisateur existe déjà"
else
  echo -e "${YELLOW}⚠️  Choisissez un mot de passe pour l'application${NC}"
  read -sp "Mot de passe APP: " APP_PASSWORD
  echo ""
  
  gcloud sql users create $DB_USER \
    --instance=$DB_INSTANCE_NAME \
    --password="$APP_PASSWORD"
  
  echo "✅ Utilisateur créé"
fi
echo ""

# Étape 6: Récupérer le Connection Name
echo -e "${GREEN}🔗 Étape 6/9 - Configuration Secret Manager${NC}"
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE_NAME --format='value(connectionName)')
echo "Connection Name: $CONNECTION_NAME"

# Créer le secret DATABASE_URL
if [ -z "$APP_PASSWORD" ]; then
  echo -e "${YELLOW}⚠️  Entrez le mot de passe APP pour créer DATABASE_URL${NC}"
  read -sp "Mot de passe APP: " APP_PASSWORD
  echo ""
fi

DATABASE_URL="postgresql://$DB_USER:$APP_PASSWORD@/$DB_NAME?host=/cloudsql/$CONNECTION_NAME&sslmode=disable"

if gcloud secrets describe database-url 2>/dev/null; then
  echo "Secret existe déjà, mise à jour..."
  echo -n "$DATABASE_URL" | gcloud secrets versions add database-url --data-file=-
else
  echo -n "$DATABASE_URL" | gcloud secrets create database-url --data-file=-
fi

# Donner accès au service Cloud Run
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role='roles/secretmanager.secretAccessor' 2>/dev/null || true

echo "✅ Secret Manager configuré"
echo ""

# Étape 7: Artifact Registry
echo -e "${GREEN}📦 Étape 7/9 - Configuration Artifact Registry${NC}"
if gcloud artifacts repositories describe $REPO_NAME --location=$REGION 2>/dev/null; then
  echo "⚠️  Repository existe déjà"
else
  gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker images for Equigestion"
  
  gcloud auth configure-docker ${REGION}-docker.pkg.dev
  echo "✅ Artifact Registry créé"
fi
echo ""

# Étape 8: Build et Push
echo -e "${GREEN}🐳 Étape 8/9 - Build et Push de l'image Docker${NC}"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
echo "Building $IMAGE_NAME..."

# Force AMD64 architecture for Cloud Run compatibility
docker build --platform linux/amd64 -t $IMAGE_NAME .
docker push $IMAGE_NAME

echo "✅ Image Docker pushée"
echo ""

# Étape 9: Déployer sur Cloud Run
echo -e "${GREEN}🚀 Étape 9/9 - Déploiement sur Cloud Run${NC}"
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE_NAME \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --add-cloudsql-instances=$CONNECTION_NAME \
  --set-secrets=DATABASE_URL=database-url:latest \
  --set-env-vars="NODE_ENV=production"

APP_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo ""
echo -e "${GREEN}✅ DÉPLOIEMENT TERMINÉ !${NC}"
echo ""
echo "🌐 URL de l'application: $APP_URL"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Exécuter les migrations Prisma${NC}"
echo "Option 1 (recommandé): Via Cloud Run Job"
echo "  gcloud run jobs create ${SERVICE_NAME}-migrate \\"
echo "    --image=$IMAGE_NAME \\"
echo "    --region=$REGION \\"
echo "    --add-cloudsql-instances=$CONNECTION_NAME \\"
echo "    --set-secrets=DATABASE_URL=database-url:latest \\"
echo "    --command='npx' \\"
echo "    --args='prisma,migrate,deploy'"
echo ""
echo "  gcloud run jobs execute ${SERVICE_NAME}-migrate --region=$REGION --wait"
echo ""
echo "Option 2: Via cloud-sql-proxy local (voir DEPLOY.md)"
