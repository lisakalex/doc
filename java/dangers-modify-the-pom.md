# Dangers modifying the POM file

Let’s go through each **risk** in detail and understand *why* modifying the POM file in Jenkins (or regenerating it) is
usually discouraged — unless it’s part of a controlled, traceable process.

---

## **1. Source-of-truth confusion**

**Explanation:**
When Jenkins modifies or regenerates the `pom.xml` before deployment, the **POM that got built and deployed** is no
longer identical to the one in Git.

So if a developer checks out the code from Git later and tries to rebuild it locally, they’ll be building a **different
artifact** than what went to production.

**Real-world example:**

* Developer commits `pom.xml` (uses version `spring-boot-starter-parent:2.7.5`).
* Jenkins script updates dependencies to `2.7.6` before build.
* The prod artifact uses 2.7.6, but the repo still shows 2.7.5.
  Now, no one can tell **which version combination actually ran in production**.

**Impact:**

* Build provenance is unclear.
* Harder to debug production issues or verify patch versions.

**Best practice:**
Keep the **POM in Git as the single source of truth**, and externalize environment differences via profiles, properties,
or environment variables — not dynamic XML rewriting.

---

## **2. Inconsistent builds**

**Explanation:**
A Jenkins-generated or mutated `pom.xml` can introduce differences that make the build **non-reproducible** across
environments.

**Example:**
If your Jenkins modifies POMs to inject credentials, profiles, or versions — those changes might not exist on a local
developer machine or staging pipeline.
This leads to the infamous:

> “It worked on Jenkins but fails in production/staging/local.”

**Impact:**

* Inconsistent dependency trees.
* Build caching or artifact resolution becomes unreliable.
* Environment-specific bugs appear due to build logic, not code.

**Best practice:**
All build logic (including property substitution) should be handled by **Maven profiles** and **`-D` system properties
**, never by mutating XML.

---

## **3. Merge conflicts / noise**

**Explanation:**
If Jenkins commits the modified POM back into Git (for traceability or version tagging), you’ll quickly clutter your
repository with meaningless diffs.

**Example:**
Each Jenkins build commits:

```xml

<version>1.0.${BUILD_NUMBER}</version>
```

Now, every build creates a new commit, generating merge conflicts for every branch and drowning actual development
changes in automated commit noise.

**Impact:**

* Git history becomes unreadable.
* Merge conflicts occur frequently on the POM.
* Developers may start ignoring `pom.xml` diffs — which can hide real errors.

**Best practice:**
Use a **build version plugin** (like `buildnumber-maven-plugin`) or inject build metadata at runtime (via
`application.properties`, `-Dbuild.version`) instead of rewriting the POM.

---

## **4. Difficult rollback**

**Explanation:**
If Jenkins mutates the POM and something breaks in production, rolling back isn’t straightforward because the exact POM
used may not exist in Git.

**Example:**

* Jenkins auto-bumped dependency versions or switched repositories.
* Production broke.
* Developers try to revert, but they can’t reproduce the POM that was actually built because Jenkins generated it on the
  fly and didn’t archive it.

**Impact:**

* Manual reconstruction of build configurations.
* Slower recovery during outages.
* Potential mismatch between rollback binary and previous config.

**Best practice:**
Archive the **build artifacts and POM snapshot** used for each deployment (e.g., store in Nexus/Artifactory with a build
manifest).
That ensures you can rebuild or re-deploy exactly the same artifact.

---

## **5. Reproducibility loss**

**Explanation:**
A fundamental DevOps and Maven principle is **deterministic builds** — same source, same POM, same dependencies → same
artifact.

When Jenkins mutates the POM, you lose that guarantee.

**Example:**
A job injects a plugin or repository into the POM at build time.
That means each pipeline run could produce slightly different binaries — even if the source code and Git POM never
changed.

**Impact:**

* Makes compliance and audits impossible (“Which exact code and config produced this JAR?”).
* Harder to verify builds in regulated or ISO-certified environments.
* Inconsistent testing results.

**Best practice:**
Use the **same immutable POM** for all builds and pass environment-specific settings through:

* Maven profiles (`<profiles>`)
* Command-line parameters (`mvn clean package -Denv=prod`)
* External config files (`application-prod.yml`)

---

## **Summary Table**

| **Risk**                  | **Why it Happens**                        | **Impact**                               | **Best Practice**                  |
|---------------------------|-------------------------------------------|------------------------------------------|------------------------------------|
| Source-of-truth confusion | Jenkins modifies POM differently than Git | Devs can’t tell which config ran in prod | Keep one canonical POM in Git      |
| Inconsistent builds       | Jenkins POM differs from local build      | “Works in dev, fails in prod”            | Use Maven profiles & env vars      |
| Merge conflicts / noise   | Jenkins commits modified POMs             | Git history cluttered, merge hell        | Don’t commit runtime-modified POMs |
| Difficult rollback        | Jenkins changes not versioned properly    | Hard to restore known-good state         | Archive POM & artifact per build   |
| Reproducibility loss      | Builds not deterministic                  | Compliance & debugging impossible        | Immutable builds, logged metadata  |

---

## **References**

* *Quick Intro to Spring Cloud Configuration* — Baeldung ([Baeldung on Kotlin][1])
* *Spring Cloud Config official site / docs* — Spring Cloud ([cloud.spring.io][2])
* *Spring Cloud Config Reference (server, client, etc.)* — Spring Cloud docs ([Home][3])
* *Using Spring Cloud Config Without Git* — Baeldung ([Baeldung on Kotlin][4])

[1]: https://www.baeldung.com/spring-cloud-configuration?utm_source=chatgpt.com "Quick Intro to Spring Cloud Configuration - Baeldung"

[2]: https://cloud.spring.io/spring-cloud-config/?utm_source=chatgpt.com "Spring Cloud Config"

[3]: https://docs.spring.io/spring-cloud/docs/current/reference/html/?utm_source=chatgpt.com "Spring Cloud Reference Documentation"

[4]: https://www.baeldung.com/spring-cloud-config-without-git?utm_source=chatgpt.com "Using Spring Cloud Config Without Git | Baeldung"
