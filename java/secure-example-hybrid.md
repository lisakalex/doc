# Secure Mule app XML Hybrid

When your **Mule environment type** in the Anypoint Platform shows **“Hybrid”**, it means that your **on-prem Mule
Runtimes are registered and managed through Anypoint Runtime Manager (ARM)**.

---

## 1. What “Hybrid” Means

In the **Anypoint Platform > Runtime Manager**, Mule environments can be of three types:

| Environment Type       | Description                                                                                                                                                     |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **CloudHub**           | Fully hosted by MuleSoft in AWS — Mule workers run in MuleSoft-managed VPCs.                                                                                    |
| **Hybrid**             | Mule Runtimes are installed on-premise or in your own cloud, but are **registered in Runtime Manager** — you can deploy, monitor, and manage them via Anypoint. |
| **Standalone / Local** | Mule Runtimes run completely outside the Anypoint control plane (not registered with Runtime Manager).                                                          |

So in your case:

* The runtime is **on-premise** (you control infrastructure).
* It’s **connected to Anypoint Runtime Manager**, so Anypoint knows about that server or cluster.
* You can deploy applications to it through **Runtime Manager** just like a CloudHub app.

---

## 2. Implications for Secrets Management

Because your runtime is **Hybrid (registered in ARM)**, it can:
✅ Use **Anypoint Secrets Manager** just like CloudHub.
✅ Resolve `${secure::}` properties automatically at runtime.
✅ Participate in centralized secret management and policy enforcement.

So your CloudHub and on-prem environments can share identical configuration:

```xml
user="${secure::db.username}"
        password="${secure::db.password}"
```

No difference in application XML or properties.

---

## 3. How to Confirm It’s Linked Properly

In **Anypoint Platform → Secrets Manager → Secret Groups**, you should see something like:

```
Linked Environments:
- Production (CloudHub)
- Production (Hybrid)
```

That means your **Hybrid on-prem environment** has access to the same secret group, and Mule apps deployed to either
location can resolve the same secure properties.

---

## 4. Summary

| Capability                           | CloudHub | Hybrid (On-Prem Registered) |
|--------------------------------------|----------|-----------------------------|
| Deploy via Runtime Manager           | ✅        | ✅                           |
| Use Anypoint Secrets Manager         | ✅        | ✅                           |
| Access Secrets via `${secure::}`     | ✅        | ✅                           |
| Requires Connection to Control Plane | ✅        | ✅                           |

In other words — **yes**, “Hybrid” confirms that your on-prem Mule Runtime **is registered in Runtime Manager**, and it
can fully leverage **Anypoint Secrets Manager** for secrets resolution.
