# Manual container image build

Building and pushing the two LiveQuote container images by hand on the build
server, when the Jenkins job is not the right tool — reconstructed from a real
session, with the parts that should never have been typed replaced by the way
they should be done instead.

**Scope.** This is the container path: clone a branch, assemble two build
contexts, build `cmaweb` and `php-fpm`, push both to ECR. It is *not* the
Elastic Beanstalk path that `build_ebs_zip.gdsl` automates — that job zips
`.platform/`, `cma/`, `CMALoader/`, `dbbackup/`, `phpdocker/` and
`docker-compose.yml` and uploads the archive to Artifactory. Different
artefact, different destination.

## Placeholders

Everything below uses these. Set them once; nothing further is hard-coded.

| Placeholder | Meaning | Example |
|---|---|---|
| `<jenkins-host>` | the build server | the box you `ssh` into |
| `<ecr-account>` | AWS account that owns the ECR registry | 12 digits |
| `<cc-account>` | AWS account that owns the CodeCommit repo | 12 digits, **not the same one** |
| `<you>` | your CodeCommit HTTPS Git username | an email address |
| `BUILD` | build number, used as the image tag suffix | `166` |
| `BRANCH` | branch to build | `ITST0113` |

```bash
BUILD=166
BRANCH=ITST0113
REPO=<codecommit-repo>
ECR=<ecr-account>.dkr.ecr.eu-central-1.amazonaws.com
WORK=~/livequote/checkmarx2.0
```

Note the two regions. CodeCommit is in `eu-west-2`; ECR is in `eu-central-1`.
They are not a typo for each other, and a command pointed at the wrong one
fails in a way that reads like a permissions problem.

## Before you start

You need, on the build server:

- `sudo` to the `jenkins` user (the Docker daemon socket and the image cache
  belong to it)
- Docker running
- CodeCommit HTTPS Git credentials for `<you>`
- AWS credentials that can `ecr:GetAuthorizationToken` and push to the
  `livequote-repo` repository

Read **Credentials** below before you obtain the last of those. How you get
them onto the box matters more than which ones you get.

## 1. Become the jenkins user and clear the work area

```bash
sudo -su jenkins
cd ~/livequote/checkmarx2.0
```

Remove any previous checkout. A plain `rm -r` stops on every write-protected
object in `.git/objects/pack/` and asks — which, on a pack directory, is
dozens of prompts:

```bash
rm: remove write-protected regular file '.../pack-6773931d.pack'?
```

Those files are mode `444` because Git writes packs read-only on purpose. They
are still yours to delete; the prompt is `rm` being careful, not a permission
failure. Answer it once and for all:

```bash
rm -rf ITST0113/
```

`-f` is what suppresses the prompt. You should not need `sudo` here — if you
do, something else created the tree as another user, and that is worth
understanding before you delete it.

## 2. Clone the branch

```bash
git clone --branch "$BRANCH" \
  "https://git-codecommit.eu-west-2.amazonaws.com/v1/repos/$REPO" "$BRANCH"
```

It will ask for a username and password. **The username is not just your email
address.** When your IAM principal lives in a different account from the
repository, CodeCommit's HTTPS Git credentials take the form:

```
<you>@example.com-at-<cc-account>
```

The `-at-<account-id>` suffix is how CodeCommit resolves which account to
authenticate against. Without it you authenticate against the wrong directory
and get:

```
fatal: unable to access '.../<codecommit-repo>/': The requested URL returned error: 403
```

A 403 here means **authentication succeeded or failed silently and
authorisation was refused** — it is not a "repository not found". Check, in
this order:

1. The username has the `-at-<cc-account>` suffix.
2. The HTTPS Git credentials are the ones generated in **IAM → your user →
   Security credentials → HTTPS Git credentials for CodeCommit**, not your
   console password and not an access key.
3. Your principal actually has `codecommit:GitPull` on that repository ARN.

Retrying the same command with the same inputs will produce the same 403. If
the first attempt fails, change something before the second.

The clone leaves you with:

```
cma  CMALoader  containers  containers.json  environments.json  lambda-layers.json  README.md  S3
```

## 3. Assemble the two build contexts

Both Dockerfiles contain `COPY ./cma/ /application`, and a `COPY` source must
live inside the build context. `cma/` sits at the repository root, so it has to
be copied into each container directory before building:

```bash
cd "$BRANCH"
cp -R cma/ ./containers/php-fpm/
cp -R cma/ ./containers/cmaweb/
```

This is the step that is easy to forget and produces a confusing error — not
"file not found" but a build that succeeds against a stale `cma/` left behind
from a previous run. **If you are rebuilding, delete the old copies first**, or
you will ship last week's application inside this week's tag:

```bash
rm -rf ./containers/php-fpm/cma ./containers/cmaweb/cma
```

Each context is roughly 13 MB once `cma/` is in place. If the `transferring
context` line in the build output reads `2B`, the copy did not happen.

## 4. Build the images

Two images, built separately, each from its own directory.

```bash
cd containers/cmaweb
docker build -t "livequote-repo:cmaweb_$BUILD" .
```

`cmaweb` is the web tier: `nginx:stable`, with the application at
`/application`, the TLS key pair copied to `/etc/nginx/certs/`, and
`nginx.conf` and `mime.types` replacing the stock configuration.

```bash
cd ../php-fpm
docker build -t "livequote-repo:php-fpm_$BUILD" .
```

`php-fpm` is the application tier: `phpdockerio/php:8.3-fpm`, plus
`php8.3-mysql` and `php8.3-soap`, with `php-ini-overrides.ini` dropped into
`conf.d/`.

That image contains a self-check worth keeping:

```dockerfile
RUN php -m | grep -q pdo_mysql && php -r 'echo "PDO MySQL OK, SSL_CA constant = ", PDO::MYSQL_ATTR_SSL_CA, PHP_EOL;'
```

It fails the build if `pdo_mysql` is missing, rather than letting the image
ship and the application fail on its first database call. A build-time
assertion about a runtime dependency is the cheapest test there is.

**Use the same `$BUILD` for both images.** They are deployed together by one
task definition, and a mismatched pair is hard to spot and harder to explain.

## 5. Authenticate to ECR

```bash
aws ecr get-login-password --region eu-central-1 \
  | docker login --username AWS --password-stdin "$ECR"
```

Confirm you are pointed at the right account *before* you push, not after:

```bash
aws sts get-caller-identity
```

The `Account` it prints must be the ECR account. Pushing to the wrong registry
is a slow mistake to notice, because the push succeeds.

Docker will warn you:

```
WARNING! Your credentials are stored unencrypted in '/var/lib/jenkins/.docker/config.json'.
```

Take that literally. See **Credentials**. The ECR token itself is good for
12 hours; `docker logout` ends it sooner.

## 6. Tag and push

```bash
docker tag "livequote-repo:cmaweb_$BUILD"  "$ECR/livequote-repo:cmaweb_$BUILD"
docker push "$ECR/livequote-repo:cmaweb_$BUILD"

docker tag "livequote-repo:php-fpm_$BUILD" "$ECR/livequote-repo:php-fpm_$BUILD"
docker push "$ECR/livequote-repo:php-fpm_$BUILD"
```

Both images go to the **same** ECR repository, `livequote-repo`, distinguished
only by tag prefix. `Layer already exists` lines are normal and good — the base
layers are shared.

Each push ends with a line like `cmaweb_166: digest: sha256:... size: ...`.
Record both digests in the change ticket. The tag is what you type; the digest
is what actually ran, and only one of the two is immutable.

## 7. Verify

```bash
aws ecr describe-images --region eu-central-1 \
  --repository-name livequote-repo \
  --image-ids imageTag="cmaweb_$BUILD" imageTag="php-fpm_$BUILD" \
  --query 'imageDetails[].{tag:imageTags[0],digest:imageDigest,pushed:imagePushedAt}' \
  --output table
```

Two rows, both pushed in the last few minutes, and the digests matching what
`docker push` printed.

## Credentials

The session this was reconstructed from did this:

```bash
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQoJ..."
```

Do not do that. Three separate things go wrong at once:

1. **Shell history.** The exports land in `~/.bash_history` for the `jenkins`
   user. That is a *shared* account — everyone who can `sudo -su jenkins` can
   read them.
2. **Docker's config file.** `docker login` writes the registry token to
   `/var/lib/jenkins/.docker/config.json` in plain base64, and says so. It
   persists after your session ends.
3. **Scrollback.** Terminal output gets pasted into tickets, chat and
   documents. A secret that has been on a screen has been copied.

Use instead, in order of preference:

- **An instance role on the build server.** No key material anywhere; the SDK
  picks the credentials up from the instance metadata service, and ECR login
  works with no exports at all. This is the right answer for a build host.
- **`aws sso login --profile <profile>`**, then `AWS_PROFILE=<profile>` for the
  commands. The tokens live in `~/.aws/sso/cache/` with a short lifetime and
  never pass through your shell history.
- **A named profile in `~/.aws/credentials`**, if the first two are not
  available.

If credentials ever do reach a shell or a terminal buffer, treat them as
compromised: revoke the session, rotate the principal, and remove the history
entry. Temporary credentials expiring on their own is not a substitute — the
window is hours, and that is long enough.


## 8. Clean up

```bash
docker logout "$ECR"
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
exit                      # leave the jenkins shell
```

Then update the image tags in `containers/taskdef-livequote-{dev,preprod,prod}.json`
as `containers/README.md` describes, and deploy through the normal route.

## What this transcript does not explain

Honesty about the limits of a reconstruction:

- Four consecutive clone attempts returned 403, and the directory listing
  immediately afterwards showed a populated checkout. The transcript does not
  show which attempt succeeded, so the exact working username form is **not**
  confirmed by it. The `-at-<account-id>` rule above comes from CodeCommit's
  documented behaviour, not from this session. Verify it on your first run.
- The `containers/` directory also holds `README.md` and three task
  definitions. Whatever those say takes precedence over this page; they sit
  next to the code and this does not.

## Things worth fixing

Noticed while reading the build output, in rough order of how much they matter.

**`chmod -R 667` on the application tree.** Both Dockerfiles do a variant of:

```dockerfile
RUN mkdir -m 667 -p /application
RUN chmod -R 667 /application
```

Mode `667` on a *directory* is `rw-`, `rw-`, `rwx`. The owner and group cannot
traverse it — no execute bit — and everyone else can traverse **and write** to
it. The containers work only because their runtime user (`nginx`,
`www-data`) falls into the "other" class and picks up the `7`. So the
application directory is world-writable inside the container, and it is
load-bearing. `755` for directories and `644` for files is almost certainly
what was meant. The same applies to:

```dockerfile
RUN chmod -R 667 /application/public/cert/temp.pem
```

which makes a certificate file world-writable.

**The TLS key is baked into the image.** `cert/nginx-lq.key` is copied in at
build time, so it lives in a layer, is visible to anyone who can pull the
image, and cannot be rotated without a rebuild. A secret belongs in Secrets
Manager or an SSM parameter, mounted at run time by the task definition.

**`cma/` is duplicated into both contexts by hand.** Two copies, no check that
they match, and a stale copy builds silently. A `.dockerignore` plus a single
shared context, or a small `make` target that does the copy and the build
together, removes a whole class of "why is the old code in the new image"
incidents.

**Nothing pins the base images.** `nginx:stable` and `phpdockerio/php:8.3-fpm`
are moving tags. The build output records the digest that was actually
resolved — pin to it, so that rebuilding the same `$BUILD` produces the same
image.

**No `--provenance` or scan step.** The Jenkins job runs SonarQube over the
source before archiving. The manual path skips it, so an image built this way
has had less checking than one built by the job. That is the real cost of the
manual route, and the reason to use it only when you have to.
