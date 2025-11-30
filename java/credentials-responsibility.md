# Credentials responsibility

It’s **everyone’s** who touches the pipeline, but in real organizations the **responsibility is split like this** (2025
reality):

| Who actually owns it today         | What they are responsible for                                                                                                                                                 | What they usually screw up                                                                 |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Developers / Application teams** | Never put **runtime secrets** (DB password, API keys, JWT secrets, etc.) into `pom.xml`, `application.yml`, or any file that gets packaged into the JAR/WAR                   | Most common leak: committing `src/main/resources/application-prod.yml` with real passwords |
| **DevOps / Platform / SRE teams**  | Never put **build/deploy credentials into `pom.xml` (or any repo file). Provide and enforce secure mechanisms (temporary `settings.xml`, credential injection, secret stores) | Most common leak: old Jenkins jobs that still `sed` passwords into `pom.xml`               |
| **Security team**                  | Define policy, scan artifacts, block bad deployments if secrets are detected                                                                                                  | They can only catch it **after** it already happened                                       |

### Real-world distribution of blame (from incident post-mortems I’ve seen)

| Leak type                                           | Who usually caused it    | Who usually gets yelled at |
|-----------------------------------------------------|--------------------------|----------------------------|
| Database password in `application-prod.yml`         | Developer                | Developer                  |
| AWS key in `pom.xml` for a third-party repo         | Developer or old script  | Developer                  |
| Nexus deploy password injected into `pom.xml` in CI | DevOps / old Jenkins job | DevOps                     |
| Vault token accidentally checked into repo          | Developer                | Developer                  |
| `settings.xml` copied into Docker image             | DevOps                   | DevOps                     |

### The only arrangement that actually works in 2025

| Role                  | Non-negotiable responsibilities                                                                                                                                                                                                                                                                                  |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Developers**        | 1. Never commit any real secret anywhere<br>2. Mark runtime secrets with placeholders (`{{DB_PASSWORD}}` or `${DB_PASSWORD}`)<br>3. Fail the build locally if a secret is detected (git-secrets, Gitleaks pre-commit)                                                                                            |
| **DevOps / Platform** | 1. Never modify `pom.xml` in CI/CD<br>2. Provide working patterns (temporary `settings.xml`, Vault sidecar, AWS Secrets Manager integration, etc.)<br>3. Scan every artifact before it reaches production (Trivy, OWASP Dependency-Check, GitGuardian)<br>4. Block deployment automatically if secrets are found |
| **Security**          | Write the policy, run the scanners, own the “secrets in artifacts” metric on the dashboard                                                                                                                                                                                                                       |

### One-sentence rule that ends all arguments

> “If the secret is needed **at runtime by the Java application**, it is the **developer’s** responsibility.  
> If the secret is needed **only to build or deploy** the artifact, it is **DevOps’** responsibility.”

Everything else is just finger-pointing.

So in your specific case (“credentials injected into pom.xml in Jenkins to deploy”):  
That is 100 % **DevOps / CI-CD team responsibility** — and the correct fix (temporary `settings.xml`) is also theirs to
implement and enforce.

Make the platform team own it, give them the pattern from the earlier message, and the problem disappears forever.