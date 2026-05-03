# Deployment Guide

## Prerequisites
- Google Cloud Platform Account
- Google Cloud SDK (`gcloud` CLI) installed locally
- Docker installed locally
- GitHub repository with Actions enabled

## 1. Initial Setup
Run the setup script to provision GCP resources:
```bash
./create-gcp-resources.sh
```

## 2. GitHub Secrets
Add the following secrets to your GitHub repository:
- `GCP_PROJECT_ID`: Your Google Cloud Project ID
- `GCP_SA_KEY`: Service Account JSON Key
- `CLOUD_SQL_CONNECTION`: Cloud SQL connection name

## 3. Continuous Deployment
Deployment is fully automated via GitHub Actions.
1. Push to the `main` branch.
2. The workflow in `.github/workflows/deploy.yml` will:
   - Run tests
   - Build Docker images
   - Push images to Google Container Registry
   - Deploy backend and frontend to Cloud Run
