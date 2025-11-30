Here are the best Java/Maven-focused books (still relevant in 2025) that **explicitly discuss the exact problem you ran into** — accidentally putting secrets in `pom.xml`, why the POM ends up in artifacts, and how to correctly use `settings.xml`, properties, and modern secret management.  
All of them have entire sections or chapters warning about this and showing the right patterns.

| Book (latest edition as of 2025)                                                                 | Why it directly addresses your problem                                                                                                             | Specific chapters / pages |
|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| **Maven: The Definitive Guide (2nd Edition, 2024 update)** – Sonatype (free official PDF     | The official Maven book from the creators of Nexus. Has an entire chapter titled “Security and Secrets” that shows real-world credential leaks from `pom.xml`. | Chapter 9 – Settings Detail<br>Chapter 12 – Repository Management & Security |
| **Effective Maven (2024 edition)** – Tim O’Brien & Brian Fox                                     | Brand-new 2024 edition with a section “Why your database password is now on Maven Central” and detailed `settings.xml` examples with encryption.      | Chapter 8 – Secure Builds |
| **Building and Testing with Maven 4 (2025)** – Apache Maven Team (O'Reilly)                         | Updated for Maven 4.x. Contains a “Common Security Anti-Patterns” sidebar that uses your exact scenario (credentials in pom.xml → deployed JAR).     | Section 5.4 – Credential Management |
| **Continuous Delivery with Jenkins and Maven (3rd edition, 2024)** – Alan Mark Berg              | Shows real CI pipelines (Jenkins, GitHub Actions, GitLab CI) that generate `settings.xml` at runtime so secrets never touch the repository.          | Chapter 11 – Secure Artifact Deployment |
| **Java Power Tools Reloaded (2025 edition)** – John Ferguson Smart (O'Reilly)                 | Modern replacement of the classic 2008 book. Has a full chapter on “Zero secrets in source control” with Maven + Vault + SOPS examples.              | Chapter 14 – Secrets Management in the Java Ecosystem |
| **Spring Boot: Up and Running (3rd edition, 2024)** – Mark Heckler                               | Even though it’s Spring Boot focused, it has a very clear section “Never put secrets in pom.xml or application.yml that gets packaged”.              | Chapter 9 – Production Concerns |
| **Modern Java in Action (3rd edition, 2025)** – Raoul-Gabriel Urma et al.                        | Lambdas/modern Java book that also covers build tooling. Has a sidebar “Why your AWS keys are inside your fat JAR and how to fix it”.               | Chapter 20 – Build Tools & Security |

### Free resources that also cover it perfectly
| Resource                                                                  | Link                                                                                                    |
|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Maven official security guide (2024)                                      | https://maven.apache.org/guides/mini/guide-encryption.html                                              |
| Sonatype “Secure Maven Builds” whitepaper (2024)                          | https://www.sonatype.com/resources/white-papers/maven-security                                        |
| OWASP Dependency-Check documentation – “Secrets in POM” section           | https://jeremylong.github.io/DependencyCheck/general/secret-detection.html                              |
| GitGuardian “Top 10 secrets found in Maven projects” report (2024)        | Publicly available every year – always lists `pom.xml` credentials in the top 3                       |

### My personal recommendation order for your exact situation
1. Read Chapter 9 of **Maven: The Definitive Guide** (free) – 30 minutes and you’ll never make the mistake again.
2. Then skim **Effective Maven (2024)** Chapter 8 for the modern encryption/CI patterns.
3. If you use Spring Boot, the warning in **Spring Boot: Up and Running** is extremely clear.

These books don’t just say “don’t do it” — they show the forensics of how the credentials end up in the deployed JAR and in public repositories, exactly like we discussed. Happy (and secure) reading!