**Absolutely do NOT store credentials (passwords, API keys, tokens, etc.) directly in your `pom.xml`.**  
If you do that, here’s exactly what happens when you build and deploy:

| Step                              | What happens to the credentials                                                                                 | Risk level |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------|------------|
| `mvn package` / `mvn install`    | Credentials are copied **in plain text** into the final JAR/WAR under `META-INF/maven/.../pom.xml`               | High      |
| Deploy to any application server  | The JAR/WAR containing your plaintext passwords is copied to the server                                        | High      |
| Anyone with access to the server  | Can simply unzip the JAR/WAR or run `jar tf myapp.jar` and read your passwords instantly                        | Critical  |
| Deploy to Maven repository (`mvn deploy`) | The `pom.xml` is uploaded **as a separate .pom file** containing your plaintext credentials for the entire world to download | Catastrophic |
| Artifact scanned by tools (Snyk, Dependabot, GitGuardian, etc.) | Instantly flagged and often automatically reported or revoked                                              | Immediate |

### Real-world consequences people have suffered
- Companies have accidentally published AWS keys, database passwords, and private signing keys to Maven Central or internal Nexus/Artifactory repositories.
- Those credentials were immediately scraped by attackers → accounts compromised in minutes.
- Some organizations had to rotate hundreds of credentials and pay ransom or cleanup costs.

### Correct ways to handle secrets in a Maven project

| What you need                     | Recommended approach                                                                                           | Never ends up in pom.xml or artifact |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Passwords for `mvn deploy`        | Use `<servers>` section in your **personal** `~/.m2/settings.xml` (never commit this file)                     | Yes                                 |
| Database passwords, API keys  | Use environment variables, JNDI, Vault, AWS Secrets Manager, Kubernetes secrets, Docker secrets, etc.          | Yes                                 |
| If you really need them in pom.xml (e.g., repository passwords) | Use Maven property placeholders + `settings.xml` or CI/CD encrypted variables<br>Example:<br>`<password>${env.NEXUS_PASSWORD}</password>` | Yes                                 |
| Encrypted properties (rare)       | `maven-encrypt-properties-plugin` or tools like jasypt, but still prefer external secret management            | Yes                                 |

### Quick test you can do right now
Run this on any built artifact:

```bash
unzip -p target/myapp-1.0.jar META-INF/maven/com.example/myapp/pom.xml | grep -i password
```

If it prints anything sensitive → you have a serious problem.

### Bottom line
Never put real credentials, secrets, or tokens in `pom.xml` under any circumstances.  
The file is designed to be public and is automatically published and embedded everywhere.  
Treat `pom.xml` exactly like any other source file that will be publicly visible.

Use `settings.xml`, environment variables, or a proper secrets manager instead. Your future self (and your security team) will thank you.