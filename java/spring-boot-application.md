# Spring Boot application

This is a **Spring Boot application.yml** that’s wired to a **Spring Cloud Config Server** setup. Let’s break it
down carefully so you understand exactly what’s happening with

```yaml
uri: ${CONFIG_SERVER_URL}
```

and the rest of the file — how Spring uses these variables and what they mean in production.

```yaml
spring:
  application:
    name: api-jva-motor-addons
  cloud:
    config:
      uri: ${CONFIG_SERVER_URL}
      failFast: ${CONFIG_FAIL_FAST_FLAG}
      label: ${CONFIG_GIT_BRANCH}
  profiles:
    active:
      - ${ENV}
  main:
    banner-mode: 'off'
  servlet:
    multipart:
      max-file-size: 1Mb
      max-request-size: 10Mb
  boot:
    admin:
      client:
        enabled: false

server:
  port: ${APP_PORT}
  servlet:
    context-path: /api-jva-motor-addons/v1
  tomcat:
    basedir: /var/log/nginx
    accesslog:
      enabled: true
      buffered: false
      directory: healthd
      prefix: application.log
      suffix:
      file-date-format: .yyyy-MM-dd-HH
      pattern: '%{sec}t.%{msec_frac}t"%U"%s"%T"%T"%{x-forwarded-for}i'

logging:
  path: /var/log
  level:
    root: info
    com.esure.api: info

application:
  name: api-jva-motor-addons
  version: 1.0
  description: Implementation of motor add-ons API which calls SOAP endpoints
  licence: Licence Details
  licenceUrl: http://www.esure.com/licenses/LICENSE-2.0.html
  termsOfServiceUrl: http://www.esure.com
  createdBy: Esure Api Team
  seeMoreAtApi: https://myesure.atlassian.net/wiki/spaces/API/pages/470745115/Motor+Add-Ons+Service
  contactTheDeveloper: api-dev@esure.com

management:
  endpoints:
    web:
      exposure:
        include: "*"
  server:
    port: ${ADMIN_PORT}

environment:
  soapUrl: ${SOAP_URL}

```

---

## **1. What is `uri: ${CONFIG_SERVER_URL}`?**

This line tells your **Spring Boot application** *where* to find the **Spring Cloud Config Server** — the central
configuration service that holds environment-specific properties (like passwords, endpoints, etc.) outside the codebase.

### **Meaning:**

```yaml
spring:
  cloud:
    config:
      uri: ${CONFIG_SERVER_URL}
```

* `${CONFIG_SERVER_URL}` is an **environment variable**.

* When the app starts, Spring substitutes `${CONFIG_SERVER_URL}` with its actual value, for example:

  ```bash
  export CONFIG_SERVER_URL=https://config.esure.internal:8888
  ```

  So Spring Boot will connect to:

  ```
  https://config.esure.internal:8888
  ```

* From there, it downloads the external config file (YAML or properties) for this app and environment — for example:

  ```
  api-jva-motor-addons-prod.yml
  ```

---

## **2. How Spring Cloud Config works here**

When your service starts up:

1. It reads the **bootstrap configuration** (in this case, your `spring.cloud.config.uri`).
2. It connects to the **Config Server** specified by `${CONFIG_SERVER_URL}`.
3. The Config Server then:

    * Looks up your app name (`api-jva-motor-addons`)
    * Checks the active profile (`${ENV}` e.g., `dev`, `test`, `prod`)
    * Reads config from a Git repo or vault specified in the Config Server setup.
4. The merged configuration is then injected into your application context before it fully starts.

So the flow is like this:

```
Spring Boot Service ──► Config Server ──► Git Repo (config files per env)
```

---

## **3. Related keys explained**

Let’s go through the key sections of your YAML and explain what they mean:

### **Application metadata**

```yaml
spring:
  application:
    name: api-jva-motor-addons
```

This tells Spring Boot what this service is called. The Config Server uses this name to find configuration files (e.g.,
`api-jva-motor-addons-prod.yml`).

---

### **Spring Cloud Config section**

```yaml
spring:
  cloud:
    config:
      uri: ${CONFIG_SERVER_URL}
      failFast: ${CONFIG_FAIL_FAST_FLAG}
      label: ${CONFIG_GIT_BRANCH}
```

* **`uri`** – The Config Server URL (environment variable `CONFIG_SERVER_URL`)
* **`failFast`** – If true, the app **fails immediately** if it can’t reach the Config Server (useful in production to
  avoid running with missing configs)
* **`label`** – The Git branch used by the Config Server (e.g., `main`, `develop`)

    * Example:

      ```bash
      export CONFIG_GIT_BRANCH=main
      ```

---

### **Profiles**

```yaml
spring:
  profiles:
    active:
      - ${ENV}
```

Defines which profile is active (e.g., `dev`, `qa`, `prod`).
This helps Config Server pick the right config file:

```
api-jva-motor-addons-prod.yml
api-jva-motor-addons-dev.yml
```

---

### **Server configuration**

```yaml
server:
  port: ${APP_PORT}
  servlet:
    context-path: /api-jva-motor-addons/v1
```

* The app will run on port from env variable `${APP_PORT}`.
* The REST endpoints will be prefixed with `/api-jva-motor-addons/v1`.

Example:

```bash
export APP_PORT=8080
```

Then service runs at:

```
http://localhost:8080/api-jva-motor-addons/v1
```

---

### **Tomcat access logs**

```yaml
server:
  tomcat:
    basedir: /var/log/nginx
    accesslog:
      enabled: true
      buffered: false
      directory: healthd
      prefix: application.log
      file-date-format: .yyyy-MM-dd-HH
      pattern: '%{sec}t.%{msec_frac}t"%U"%s"%T"%T"%{x-forwarded-for}i'
```

This sets up access logs similar to Nginx style — logs requests and timing to
`/var/log/nginx/healthd/application.log...`

---

### **Logging**

```yaml
logging:
  path: /var/log
  level:
    root: info
    com.esure.api: info
```

This defines where logs are written and the verbosity level.

---

### **Metadata**

The block below defines documentation metadata — not used by Spring itself, but useful for tools like Swagger or
internal dashboards.

```yaml
application:
  name: api-jva-motor-addons
  version: 1.0
  description: Implementation of motor add-ons API which calls SOAP endpoints
```

---

### **Actuator / Management ports**

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"
  server:
    port: ${ADMIN_PORT}
```

Spring Boot Actuator (health, metrics, info) runs on its own port, from `ADMIN_PORT`.

Example:

```bash
export ADMIN_PORT=8081
```

Then:

```
http://localhost:8081/actuator/health
```

---

### **SOAP URL (service-specific environment variable)**

```yaml
environment:
  soapUrl: ${SOAP_URL}
```

This points to a backend SOAP endpoint your REST API integrates with.
Example:

```bash
export SOAP_URL=https://legacy.esure.internal/soap/motoraddons
```

---

## **4. Typical Jenkins + Spring Config Setup**

In your Jenkins pipeline, you’d pass these environment variables:

```groovy
environment {
    CONFIG_SERVER_URL = 'https://config.esure.internal:8888'
    CONFIG_FAIL_FAST_FLAG = 'true'
    CONFIG_GIT_BRANCH = 'main'
    ENV = 'prod'
    APP_PORT = '8080'
    ADMIN_PORT = '8081'
    SOAP_URL = 'https://soap.internal/motoraddons'
}
```

So Jenkins builds and runs your container like this:

```bash
docker run \
  -e CONFIG_SERVER_URL=$CONFIG_SERVER_URL \
  -e CONFIG_GIT_BRANCH=$CONFIG_GIT_BRANCH \
  -e ENV=$ENV \
  -e APP_PORT=$APP_PORT \
  -e SOAP_URL=$SOAP_URL \
  esure/api-jva-motor-addons:latest
```

Spring Boot picks them up automatically and configures itself — no need to rebuild or modify `application.yml`.

---

## **5. References**

* [Spring Cloud Config Documentation](https://spring.io/projects/spring-cloud-config)
* [Spring Boot Externalized Configuration Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
* [Spring Boot Actuator Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
* [Spring Logging Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.logging)

---

### **Summary**

| Key                        | Purpose                               | Source                |
|----------------------------|---------------------------------------|-----------------------|
| `${CONFIG_SERVER_URL}`     | URL of Spring Cloud Config Server     | Jenkins / Environment |
| `${CONFIG_FAIL_FAST_FLAG}` | Fail app if config server unreachable | Jenkins / Env         |
| `${CONFIG_GIT_BRANCH}`     | Config Git branch                     | Jenkins / Env         |
| `${ENV}`                   | Active Spring profile (e.g. prod)     | Jenkins / Env         |
| `${APP_PORT}`              | HTTP port                             | Jenkins / Env         |
| `${ADMIN_PORT}`            | Actuator port                         | Jenkins / Env         |
| `${SOAP_URL}`              | External SOAP endpoint                | Jenkins / Env         |

---

### **References**

1. **Quick Intro to Spring Cloud Configuration** – Baeldung
   [https://www.baeldung.com/spring-cloud-configuration](https://www.baeldung.com/spring-cloud-configuration)

2. **Spring Cloud Config Official Documentation** – Spring
   [https://docs.spring.io/spring-cloud-config/docs/current/reference/html/](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/)

---
