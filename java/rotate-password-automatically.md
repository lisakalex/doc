# Rotate password automatically

---

## 1. Concept Overview

**Goal:**
You want your Mule application to continue working securely even when credentials are rotated — for example, when the
database password changes due to policy, automation, or manual rotation.

---

## 2. How It Works in CloudHub

When you use **`${secure::propertyName}`** syntax in Mule and deploy to CloudHub:

1. Mule retrieves the secure property from **Anypoint Secrets Manager** at runtime.
2. Those values are cached temporarily inside the runtime.
3. When you rotate or update a secret in **Anypoint Secrets Manager**, the updated value automatically becomes available
   to all apps using it — without changing the deployment.

**Result:**
No redeployment, no file updates, no manual property edits.

---

## 3. Typical Rotation Workflow

**Step 1: Update the Secret**

* Go to **Anypoint Platform → Secrets Manager → Secret Group (e.g., `prod-db-secrets`)**
* Select `db.password`
* Update its value (e.g., new rotated password)

**Step 2: Save and Activate**

* Save changes and ensure the secret is marked as “Active”.
* Mule CloudHub applications will begin reading the new value during the next secret retrieval cycle (immediate for new
  connections, transparent for existing ones).

**Step 3: Database Alignment**

* Update the actual database system with the new password (this should happen simultaneously, often via automated
  rotation scripts or AWS Secrets Manager integration).

---

## 4. Optional: AWS Secrets Manager Integration (for Auto-Rotation)

If you already manage secrets in **AWS Secrets Manager**, you can **sync AWS Secrets Manager → Anypoint Secrets Manager
**:

* Use AWS Lambda or a CI/CD job to update Anypoint Secrets Manager via API whenever AWS secrets rotate.
* Mule apps on CloudHub will automatically pick up the change, maintaining alignment between AWS and Anypoint.

Example (pseudo):

```bash
# Get rotated secret from AWS
NEW_SECRET=$(aws secretsmanager get-secret-value --secret-id prod-db-secret --query SecretString --output text | jq -r .password)

# Update in Anypoint Secrets Manager via API
curl -X PATCH \
  https://anypoint.mulesoft.com/secrets/api/v1/organizations/{orgId}/environments/{envId}/secrets/{secretId} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"value\": \"$NEW_SECRET\"}"
```

This ensures Mule applications always consume the latest valid credentials.

---

## 5. Rotation Without Downtime

**Scenario: Database Connection Pool**

If you use a database connection pool (like Mule DB connector does internally):

* Existing connections will continue using the old password until they expire.
* New connections (after rotation) will use the new password automatically.
* To accelerate the transition, you can gracefully restart or recycle the Mule app’s connections.

Example (optional flow trigger):

```xml

<flow name="refresh-db-connections">
    <scheduler frequency="1h"/>
    <db:disconnect-all config-ref="Secure_DB_Config"/>
    <logger message="Database connections refreshed to apply new secrets"/>
</flow>
```

---

## 6. Summary

| Aspect           | Description                                 |
|------------------|---------------------------------------------|
| Secret Storage   | Anypoint Secrets Manager                    |
| Rotation Trigger | Manual or Automated (AWS, script, or CI/CD) |
| Mule Impact      | None — no redeploy required                 |
| Propagation      | Automatic on next connection retrieval      |
| Security         | Encrypted, centralized, auditable           |

---
