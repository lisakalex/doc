# Introduction to Jenkins: The King of CI/CD

Jenkins is the most popular **open-source automation server** in the world for **Continuous Integration (CI)** and **Continuous Delivery/Deployment (CD)**. It helps development teams automate building, testing, and deploying code — making software delivery faster, safer, and more reliable.

#### Quick Facts
- First released: 2005 (originally called Hudson)
- Written in: Java
- License: Open source (MIT License)
- Users: Used by over 1.7 million people worldwide (Netflix, Facebook, LinkedIn, NASA, etc.)
- Latest stable version (Nov 2025): 2.478+

#### Core Concepts of Jenkins

| Concept              | What it means                                                                 |
|----------------------|---------------------------------------------------------------------------------|
| **Job / Project**    | A single automation task (e.g., build a Java app, run tests, deploy to AWS)    |
| **Build**            | One execution of a job (e.g., Build #42)                                        |
| **Pipeline**         | Modern way to define your entire CI/CD process as code (using Jenkinsfile)     |
| **Node / Agent**     | Machines (or containers) that actually execute the builds                      |
| **Plugin**           | Extensions that add functionality (Git, Docker, Slack, Kubernetes, etc.)      |

#### Two Ways to Use Jenkins Today

1. **Freestyle Projects** (old-school GUI way)  
   Good for simple tasks, but not recommended for new projects.

2. **Pipeline** (recommended modern way)  
   You write your entire workflow in code using **Jenkinsfile** (written in Groovy DSL).

#### Simple Example: Jenkinsfile (Declarative Pipeline)

```groovy
pipeline {
    agent any                     // Run on any available agent

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/yourname/my-app.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'   // or npm install, gradlew, etc.
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Deploy to Staging') {
            when { branch 'main' }
            steps {
                sh './deploy-staging.sh'
            }
        }
    }

    post {
        success {
            slackSend(channel: '#deploys', message: "Build ${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded!")
        }
        failure {
            slackSend(channel: '#deploys', message: "Build failed!")
        }
    }
}
```

#### Typical CI/CD Flow with Jenkins

1. Developer pushes code to GitHub/GitLab
2. GitHub sends webhook → Jenkins starts a build
3. Jenkins pulls code
4. Runs tests (unit, integration, security scans)
5. Builds artifact (JAR, Docker image, etc.)
6. Deploys to staging / runs performance tests
7. On success → deploys to production (manual approval optional)

#### Why People Love Jenkins

- 100% free and open source
- Over 1,800 plugins → integrates with literally everything
- Huge community and enterprise support (via CloudBees)
- Works on-premises or in the cloud
- Jenkins X (now deprecated) inspired modern tools like Tekton

#### Modern Alternatives (2025 landscape)

| Tool              | When to choose instead of Jenkins                     |
|-------------------|--------------------------------------------------------|
| GitHub Actions    | You already live in GitHub, want everything in one place |
| GitLab CI         | You use GitLab                                          |
| CircleCI          | Want faster, simpler cloud experience                   |
| Argo Workflows / Tekton | Kubernetes-native pipelines                            |
| Jenkins (still!)  | You need maximum flexibility, plugins, or on-prem control |

#### How to Get Started Today (5 minutes)

1. Go to https://www.jenkins.io/download/
2. Try it instantly (no install):
    - Docker: `docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts`
    - Or use https://jenkins.io/try (official sandbox)
3. Unlock Jenkins → create admin user
4. Install recommended plugins
5. Create your first “Pipeline” project and paste a Jenkinsfile

Jenkins is still the most powerful and flexible CI/CD tool in 2025 — especially when you need to integrate with legacy systems or have complex requirements.
