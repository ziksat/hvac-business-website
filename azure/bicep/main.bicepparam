using './main.bicep'

param appName = 'hvac-business'
param location = 'eastus'
param sqlAdminLogin = 'hvacadmin'
param sqlAdminPassword = '' // Set via Azure CLI or GitHub Secrets
param jwtSecret = '' // Set via Azure CLI or GitHub Secrets  
param sku = 'B1'
