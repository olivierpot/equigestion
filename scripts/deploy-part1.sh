#!/bin/bash
set -e

# Configuration
PROJECT_ID="equigestion-prod-2026"
REGION="europe-west9"
DB_INSTANCE_NAME="equigestion-db"
DB_NAME="equigestion"
DB_USER="appuser"
SERVICE_NAME="equigestion"
REPO_NAME="equigestion-repo"

echo "🚀 Déploiement Equigestion sur Google Cloud"
echo "============================================"
echo ""

# 1. Configuration du projet
echo "📋 Étape 1/9 - Configuration du projet..."
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION

# 2. Activation des APIs
echo "🔌 Étape 2/9 - Activation des APIs Google Cloud..."
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com

echo "✅ APIs activées avec succès"
echo ""
echo "⏸️  Script en pause. Étapes suivantes nécessitent des entrées manuelles."
echo ""
echo "📝 PROCHAINES ACTIONS MANUELLES:"
echo ""
echo "3. Créer Cloud SQL (PostgreSQL):"
echo "   gcloud sql instances create $DB_INSTANCE_NAME \\"
echo "     --database-version=POSTGRES_15 \\"
echo "     --tier=db-f1-micro \\"
echo "     --region=$REGION \\"
echo "     --root-password=[CHOISIR_UN_MOT_DE_PASSE_FORT] \\"
echo "     --storage-type=HDD \\"
echo "     --storage-size=10GB \\"
echo "     --backup-start-time=03:00"
echo ""
echo "4. Créer la base de données:"
echo "   gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE_NAME"
echo ""
echo "5. Créer l'utilisateur app:"
echo "   gcloud sql users create $DB_USER \\"
echo "     --instance=$DB_INSTANCE_NAME \\"
echo "     --password=[MOT_DE_PASSE_APP]"
echo ""
echo "💡 Une fois ces étapes terminées, lancez: ./scripts/deploy-part2.sh"
