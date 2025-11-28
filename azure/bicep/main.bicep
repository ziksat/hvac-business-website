// HVAC Business Website - Azure Infrastructure
// This Bicep template deploys all required Azure resources

@description('Name for the HVAC application')
param appName string

@description('Location for all resources')
param location string = resourceGroup().location

@description('SQL Server admin login')
param sqlAdminLogin string

@description('SQL Server admin password')
@secure()
param sqlAdminPassword string

@description('JWT secret key')
@secure()
param jwtSecret string

@description('App Service Plan SKU')
@allowed([
  'F1'
  'B1'
  'B2'
  'S1'
  'S2'
  'P1V2'
  'P2V2'
])
param sku string = 'B1'

// Variables
var appServicePlanName = '${appName}-plan'
var webAppName = '${appName}-web'
var apiAppName = '${appName}-api'
var functionAppName = '${appName}-functions'
var sqlServerName = '${appName}-sql'
var sqlDatabaseName = '${appName}-db'
var storageAccountName = replace('${appName}storage', '-', '')
var appInsightsName = '${appName}-insights'

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

// SQL Server
resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

// SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
  }
}

// SQL Firewall Rule - Allow Azure Services
resource sqlFirewallRule 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: sku
  }
  properties: {
    reserved: false
  }
}

// API App Service
resource apiApp 'Microsoft.Web/sites@2022-09-01' = {
  name: apiAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      nodeVersion: '~18'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'DB_SERVER'
          value: '${sqlServerName}.database.windows.net'
        }
        {
          name: 'DB_DATABASE'
          value: sqlDatabaseName
        }
        {
          name: 'DB_USER'
          value: sqlAdminLogin
        }
        {
          name: 'DB_PASSWORD'
          value: sqlAdminPassword
        }
        {
          name: 'JWT_SECRET'
          value: jwtSecret
        }
        {
          name: 'FRONTEND_URL'
          value: 'https://${webAppName}.azurewebsites.net'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
      ]
    }
  }
}

// Web App Service
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      nodeVersion: '~18'
      appSettings: [
        {
          name: 'REACT_APP_API_URL'
          value: 'https://${apiAppName}.azurewebsites.net/api'
        }
      ]
    }
  }
}

// Function App
resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      nodeVersion: '~18'
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'DB_SERVER'
          value: '${sqlServerName}.database.windows.net'
        }
        {
          name: 'DB_DATABASE'
          value: sqlDatabaseName
        }
        {
          name: 'DB_USER'
          value: sqlAdminLogin
        }
        {
          name: 'DB_PASSWORD'
          value: sqlAdminPassword
        }
      ]
    }
  }
}

// Outputs
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output apiAppUrl string = 'https://${apiApp.properties.defaultHostName}'
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output sqlServerFqdn string = '${sqlServerName}.database.windows.net'
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
