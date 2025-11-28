# Azure Deployment Guide

This guide covers deploying the HVAC Business Website to Microsoft Azure.

## Prerequisites

- Azure subscription
- Azure CLI installed
- GitHub account (for CI/CD)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Azure Cloud                              │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │   Web App       │    │   API App       │                     │
│  │   (Frontend)    │───▶│   (Backend)     │                     │
│  │   React Build   │    │   Node.js       │                     │
│  └─────────────────┘    └────────┬────────┘                     │
│                                  │                               │
│  ┌─────────────────┐    ┌────────▼────────┐                     │
│  │ Azure Functions │    │  Azure SQL      │                     │
│  │ - Reminders     │───▶│  Database       │                     │
│  │ - Cleanup       │    │                 │                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ Blob Storage    │    │ App Insights    │                     │
│  │ (Images/Files)  │    │ (Monitoring)    │                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Step 1: Azure Login

```bash
az login
```

## Step 2: Create Resource Group

```bash
az group create --name hvac-rg --location eastus
```

## Step 3: Deploy with ARM Template

### Generate Secure Passwords

```bash
# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Generate SQL password (minimum 8 characters, with uppercase, lowercase, and numbers)
SQL_PASSWORD="HvacAdmin2024!"
```

### Deploy Resources

```bash
az deployment group create \
  --resource-group hvac-rg \
  --template-file azure/arm-templates/main.json \
  --parameters appName=hvac-business \
  --parameters sqlAdminLogin=hvacadmin \
  --parameters sqlAdminPassword=$SQL_PASSWORD \
  --parameters jwtSecret=$JWT_SECRET
```

### Get Deployment Outputs

```bash
az deployment group show \
  --resource-group hvac-rg \
  --name main \
  --query properties.outputs
```

## Step 4: Initialize Database

1. Get the SQL Server connection info from the deployment outputs
2. Connect using Azure Data Studio or SQL Server Management Studio
3. Run the schema and seed scripts:
   ```sql
   -- Run database/schema.sql
   -- Run database/seed-data.sql
   ```

## Step 5: Configure GitHub Actions

### Create Azure Service Principal

```bash
az ad sp create-for-rbac \
  --name "hvac-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/hvac-rg \
  --sdk-auth
```

### Add GitHub Secrets

In your GitHub repository, go to Settings > Secrets and add:

| Secret Name | Value |
|-------------|-------|
| AZURE_CREDENTIALS | JSON output from service principal creation |

### Update Workflow File

Update `.github/workflows/azure-deploy.yml` with your app names:

```yaml
env:
  AZURE_WEBAPP_NAME_API: hvac-business-api
  AZURE_WEBAPP_NAME_WEB: hvac-business-web
  AZURE_FUNCTIONAPP_NAME: hvac-business-functions
```

## Step 6: Deploy Code

### Option A: GitHub Actions (Automated)

Push to the main branch to trigger automatic deployment:

```bash
git push origin main
```

### Option B: Manual Deployment

#### Deploy Backend

```bash
cd backend
npm install
npm run build

# Zip the deployment package
zip -r deploy.zip . -x "node_modules/*"

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group hvac-rg \
  --name hvac-business-api \
  --src deploy.zip
```

#### Deploy Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=https://hvac-business-api.azurewebsites.net/api npm run build

# Deploy the build folder
az webapp deployment source config-zip \
  --resource-group hvac-rg \
  --name hvac-business-web \
  --src build.zip
```

#### Deploy Azure Functions

```bash
cd azure-functions
npm install
npm run build

func azure functionapp publish hvac-business-functions
```

## Step 7: Configure Custom Domain (Optional)

### Add Custom Domain

1. In Azure Portal, go to your Web App
2. Select "Custom domains"
3. Add your domain and verify ownership
4. Configure DNS records

### Enable SSL

1. In "TLS/SSL settings", select "Create App Service Managed Certificate"
2. Bind the certificate to your custom domain

## Step 8: Configure Email Settings

1. In Azure Portal, go to your API App Service
2. Select "Configuration" > "Application settings"
3. Add email configuration:
   - EMAIL_HOST
   - EMAIL_PORT
   - EMAIL_USER
   - EMAIL_PASSWORD
   - EMAIL_FROM

## Monitoring

### Application Insights

View application telemetry:

```bash
az monitor app-insights component show \
  --app hvac-business-insights \
  --resource-group hvac-rg
```

### View Logs

```bash
az webapp log tail \
  --name hvac-business-api \
  --resource-group hvac-rg
```

## Scaling

### Scale App Service

```bash
# Scale up (change pricing tier)
az appservice plan update \
  --name hvac-business-plan \
  --resource-group hvac-rg \
  --sku S1

# Scale out (add instances)
az appservice plan update \
  --name hvac-business-plan \
  --resource-group hvac-rg \
  --number-of-workers 3
```

### Scale Database

```bash
az sql db update \
  --resource-group hvac-rg \
  --server hvac-business-sql \
  --name hvac-business-db \
  --service-objective S1
```

## Backup

### Database Backup

Azure SQL Database includes automatic backups. Configure long-term retention:

```bash
az sql db ltr-policy set \
  --resource-group hvac-rg \
  --server hvac-business-sql \
  --database hvac-business-db \
  --weekly-retention "P4W"
```

## Cost Optimization

- Use Free/Basic tier for development
- Scale down during off-hours
- Use reserved instances for production
- Enable auto-scaling based on metrics

## Troubleshooting

### Check Application Logs

```bash
az webapp log download \
  --name hvac-business-api \
  --resource-group hvac-rg
```

### Restart Services

```bash
az webapp restart --name hvac-business-api --resource-group hvac-rg
az webapp restart --name hvac-business-web --resource-group hvac-rg
az functionapp restart --name hvac-business-functions --resource-group hvac-rg
```

### Check Resource Health

```bash
az resource show \
  --resource-group hvac-rg \
  --name hvac-business-api \
  --resource-type "Microsoft.Web/sites"
```
