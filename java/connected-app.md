# Connected App

### What is a "Connected App" in the MuleSoft / Anypoint Platform world?

In MuleSoft terminology, a **Connected App** is a feature of **Anypoint Platform** (not the Mule runtime itself) that lets an external application or system securely authenticate and interact with Anypoint Platform APIs and resources using OAuth 2.0.

It is the MuleSoft equivalent of what you see in Salesforce (“Connected App”), Okta (“OAuth App”), or GitHub (“OAuth App”).

### Why do you need a Connected App?

You create one whenever you want something outside of Anypoint Platform to call its APIs securely, for example:

| Use case                                    | Typical Connected App type |
|---------------------------------------------|----------------------------|
| CI/CD pipeline (Jenkins, GitHub Actions, Azure DevOps, Bitbucket) deploying Mule apps | Client Credentials flow |
| External monitoring tool pulling metrics from CloudHub or RTF | Client Credentials flow |
| Custom portal or script that manages APIs, environments, VPCs, etc. via Anypoint API | Client Credentials or Authorization Code |
| Internal tool that needs user context (who is doing the action) | Authorization Code or JWT flow |
| Partner or third-party system accessing your APIs through API Manager | Client Credentials or External Identity Provider |

### The 4 most common OAuth 2.0 grant types you can choose when creating the Connected App

| Grant Type                | When to use                                                                 | Credentials you get back      |
|---------------------------|-----------------------------------------------------------------------------|-------------------------------|
| **Client Credentials**    | Machine-to-machine (most common for CI/CD and automation)                   | Access token (no refresh)     |
| **Authorization Code**    | When you need a real user’s identity and permissions (browser-based tools) | Access token + refresh token  |
| **JWT**                   | When an external Identity Provider (IdP) asserts the identity              | Access token                  |
| **Password** (deprecated) | Direct username/password – avoid if possible                                | Access token + refresh token  |

### How to create a Connected App (step-by-step – 2025 UI)

1. Log into Anypoint Platform → **Access Management** (left menu)
2. Go to **Connected Apps** (under the “Authentication” section)
3. Click **Create application**
4. Choose the scope:
    - **Act on behalf of users** (Authorization Code / JWT) → pick specific users or user groups
    - **Act on your own behalf** (Client Credentials) → pick the organization/business groups and the permissions (environments) it can access
5. Select the exact permissions (scopes) you need, e.g.:
    - Deploy API Manager Assets
    - View Runtime Manager
    - Deploy to CloudHub
    - Read Design Center, etc.
6. Save → you get:
    - **Client ID**
    - **Client Secret** (one-time view – store it safely)

### Example: Using it with Maven or Anypoint CLI for deployments

```xml
<!-- In your ~/.m2/settings.xml -->
<servers>
  <server>
    <id>anypoint.platform</id>
    <username>my-username</username>
    <password>my-password</password>
  </server>
  <server>
    <id>connected-app</id>
    <username>~~~~client_id~~~~</username>
    <password>~~~~client_secret~~~~</password>
  </server>
</servers>
```

Then in your Mule project pom.xml:

```xml
<plugin>
  <groupId>org.mule.tools.maven</groupId>
  <artifactId>mule-maven-plugin</artifactId>
  <version>4.0.0</version>
  <configuration>
    <cloudHubDeployment>
      <uri>https://anypoint.mulesoft.com</uri>
      <server>connected-app</server>        <!-- uses Client Credentials -->
      <applicationName>my-api-prod</applicationName>
      <environment>Production</environment>
    </cloudHubDeployment>
  </configuration>
</plugin>
```

### Summary – Connected App in one sentence
A Connected App is the secure, OAuth 2.0–based way for any external tool or script to authenticate to Anypoint Platform and perform actions (deploy, monitor, manage APIs, etc.) with exactly the permissions you grant it — and it has almost completely replaced the old username/password approach in modern MuleSoft projects.
