#!/bin/bash
# Script de mise à jour - Equigestion sur GCP
# Usage: ./scripts/update.sh [--migrate]
#
# Options:
#   --migrate    Exécute les migrations Prisma via cloud-sql-proxy

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_ID="equigestion-prod-2026"
REGION="europe-west9"
SERVICE_NAME="equigestion"
REPO_NAME="equigestion-repo"
DB_INSTANCE_NAME="equigestion-db"
DB_NAME="equigestion"
DB_USER="appuser"

# Parse arguments
RUN_MIGRATE=false
for arg in "$@"; do
  case $arg in
    --migrate)
      RUN_MIGRATE=true
      shift
      ;;
  esac
done

echo -e "${BLUE}🔄 Mise à jour Equigestion${NC}"
echo "=========================="
echo ""

# Vérifier que gcloud est configuré
echo -e "${GREEN}📋 Vérification de la configuration...${NC}"
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
  echo "Configuration du projet..."
  gcloud config set project $PROJECT_ID
  gcloud config set run/region $REGION
fi
echo "✅ Projet: $PROJECT_ID"
echo ""

# Récupérer les informations nécessaires
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE_NAME --format='value(connectionName)' 2>/dev/null)
if [ -z "$CONNECTION_NAME" ]; then
  echo -e "${RED}❌ Erreur: Instance Cloud SQL non trouvée.${NC}"
  echo "Exécutez d'abord ./scripts/deploy.sh pour initialiser l'infrastructure."
  exit 1
fi

# Étape 1: Migrations Prisma (si demandé, avant le build)
if [ "$RUN_MIGRATE" = true ]; then
  echo -e "${GREEN}🗄️  Étape 1/4 - Migrations Prisma...${NC}"

  # Vérifier que cloud-sql-proxy est installé
  if ! command -v cloud-sql-proxy &> /dev/null; then
    echo -e "${RED}❌ cloud-sql-proxy n'est pas installé.${NC}"
    echo ""
    echo "Installez-le avec:"
    echo "  brew install cloud-sql-proxy"
    echo ""
    echo "Ou téléchargez-le:"
    echo "  curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.14.3/cloud-sql-proxy.darwin.arm64"
    echo "  chmod +x cloud-sql-proxy"
    echo "  sudo mv cloud-sql-proxy /usr/local/bin/"
    exit 1
  fi

  # Récupérer le mot de passe depuis le secret
  echo "Récupération des credentials..."
  DB_URL=$(gcloud secrets versions access latest --secret=database-url 2>/dev/null)

  # Extraire le mot de passe de l'URL (format: postgresql://user:pass@...)
  DB_PASS=$(echo "$DB_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

  if [ -z "$DB_PASS" ]; then
    echo -e "${YELLOW}⚠️  Impossible de récupérer le mot de passe automatiquement.${NC}"
    read -sp "Mot de passe de l'utilisateur $DB_USER: " DB_PASS
    echo ""
  fi

  # Lancer cloud-sql-proxy en arrière-plan
  echo "Démarrage de cloud-sql-proxy..."
  cloud-sql-proxy $CONNECTION_NAME --port=5433 &
  PROXY_PID=$!
  sleep 3

  # Vérifier que le proxy fonctionne
  if ! kill -0 $PROXY_PID 2>/dev/null; then
    echo -e "${RED}❌ Erreur: cloud-sql-proxy n'a pas démarré.${NC}"
    echo "Vérifiez que vous êtes authentifié: gcloud auth application-default login"
    exit 1
  fi

  # Exécuter les migrations
  echo "Application des migrations..."
  DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5433/${DB_NAME}" npx prisma migrate deploy

  # Arrêter le proxy
  kill $PROXY_PID 2>/dev/null || true

  echo "✅ Migrations appliquées"
  echo ""

  STEP_OFFSET=1
else
  STEP_OFFSET=0
fi

# Étape 2: Build Docker
STEP=$((1 + STEP_OFFSET))
TOTAL=$((3 + STEP_OFFSET))
echo -e "${GREEN}🐳 Étape ${STEP}/${TOTAL} - Build de l'image Docker...${NC}"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:${TIMESTAMP}"

docker build --platform linux/amd64 -t $IMAGE_NAME -t $IMAGE_TAG .
echo "✅ Image buildée"
echo ""

# Étape 3: Push vers Artifact Registry
STEP=$((2 + STEP_OFFSET))
echo -e "${GREEN}📤 Étape ${STEP}/${TOTAL} - Push vers Artifact Registry...${NC}"
docker push $IMAGE_NAME
docker push $IMAGE_TAG
echo "✅ Image pushée: $IMAGE_TAG"
echo ""

# Étape 4: Déploiement Cloud Run
STEP=$((3 + STEP_OFFSET))
echo -e "${GREEN}🚀 Étape ${STEP}/${TOTAL} - Déploiement sur Cloud Run...${NC}"
BUCKET_NAME="${PROJECT_ID}-photos"

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
  --set-env-vars="NODE_ENV=production,GCS_BUCKET_NAME=${BUCKET_NAME},GCS_PROJECT_ID=${PROJECT_ID}"

echo "✅ Application déployée"
echo ""

# Résumé
APP_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo -e "${GREEN}✅ MISE À JOUR TERMINÉE !${NC}"
echo ""
echo "🌐 URL: $APP_URL"
echo "🏷️  Version: $TIMESTAMP"
echo ""

if [ "$RUN_MIGRATE" = false ]; then
  echo -e "${YELLOW}💡 Si vous avez modifié le schéma Prisma:${NC}"
  echo "   ./scripts/update.sh --migrate"
fi
