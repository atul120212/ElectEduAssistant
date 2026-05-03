#!/bin/bash

# Variables
PROJECT_ID="your-project-id"
REGION="us-central1"
DB_INSTANCE="election-edu-db"
DB_NAME="election_edu"

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  cloudscheduler.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com

# Create Cloud SQL instance
gcloud sql instances create $DB_INSTANCE \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=4

# Create database
gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE

# Create database user
gcloud sql users create appuser \
  --instance=$DB_INSTANCE \
  --password=$(openssl rand -base64 32)

# Create secrets
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
echo -n "postgresql://appuser:PASSWORD@/election_edu?host=/cloudsql/PROJECT:REGION:INSTANCE" | gcloud secrets create database-url --data-file=-
echo -n $(openssl rand -base64 32) | gcloud secrets create jwt-secret --data-file=-

# Create service account for Cloud Run
gcloud iam service-accounts create cloud-run-sa \
  --display-name="Cloud Run Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:cloud-run-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

gcloud secrets add-iam-policy-binding anthropic-api-key \
  --member="serviceAccount:cloud-run-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Create Cloud Scheduler job for database cleanup (runs weekly)
gcloud scheduler jobs create http cleanup-old-data \
  --schedule="0 2 * * 0" \
  --uri="https://BACKEND_URL/api/v1/admin/cleanup" \
  --http-method=POST \
  --time-zone="America/New_York"

echo "GCP resources created successfully!"
