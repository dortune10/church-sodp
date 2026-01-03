# GitHub Actions Implementation Guide

## Overview

This document outlines the implementation of GitHub Actions CI/CD workflows for the RCCG SODP Church Website project. GitHub Actions automates testing, building, database migrations, and deployment processes on every push or pull request.

**Project Stack:**
- Next.js 16 with TypeScript
- Supabase (PostgreSQL database)
- React 19, Tailwind CSS
- Node.js 20 LTS

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [GitHub Secrets Configuration](#github-secrets-configuration)
3. [Workflow Files](#workflow-files)
4. [Implementation Steps](#implementation-steps)
5. [Workflow Descriptions](#workflow-descriptions)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Directory Structure

Create the following directory structure for GitHub Actions workflows:

```
.github/
├── workflows/
│   ├── ci.yml                 # Continuous Integration (Lint & Build)
│   ├── db-migrations.yml      # Database Migrations (Optional)
│   └── deploy.yml             # Deployment to Production (Optional)
└── CODEOWNERS                 # Optional: Define code ownership
```

---

## GitHub Secrets Configuration

Before creating workflow files, configure the following secrets in your GitHub repository:

### Steps to Add Secrets:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

### Required Secrets:

#### **For CI/Build Workflow (REQUIRED)**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Found in Supabase Dashboard → Project Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Found in Supabase Dashboard → Project Settings |

### Quick checklist (copy into GitHub → Settings → Secrets → Actions)

- [ ] NEXT_PUBLIC_SUPABASE_URL — Supabase project URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon/public key
- [ ] SUPABASE_ACCESS_TOKEN — (optional) Supabase CLI personal access token
- [ ] SUPABASE_PROJECT_ID — (optional) Supabase project ref/id
- [ ] SUPABASE_DB_PASSWORD — (optional) database password for migrations
- [ ] VPS_HOST — (optional) VPS host or IP for SSH deploys
- [ ] VPS_USER — (optional) SSH user for VPS deploys
- [ ] VPS_SSH_KEY — (optional) private SSH key (paste full multiline key)
- [ ] DOCKER_USERNAME — (optional) Docker Hub username
- [ ] DOCKER_PASSWORD — (optional) Docker Hub access token/password
- [ ] SLACK_WEBHOOK — (optional) Slack webhook for notifications


#### **For Database Migrations (OPTIONAL)**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SUPABASE_ACCESS_TOKEN` | Your Supabase Personal Access Token | Create at https://app.supabase.com/account/tokens |
| `SUPABASE_PROJECT_ID` | Your Supabase Project ID | Found in Supabase Dashboard → Project Settings |
| `SUPABASE_DB_PASSWORD` | Your Supabase DB Password | Set during Supabase project creation |

#### **For VPS Deployment (OPTIONAL)**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VPS_HOST` | Your VPS IP Address or Domain | e.g., `192.168.1.1` or `api.example.com` |
| `VPS_USER` | SSH Username | Usually `root` or `ubuntu` |
| `VPS_SSH_KEY` | SSH Private Key | Generated on your local machine |

#### **For Docker Registry (OPTIONAL)**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKER_USERNAME` | Docker Hub Username | Your Docker Hub account |
| `DOCKER_PASSWORD` | Docker Hub Personal Access Token | Create at Docker Hub settings |

---

## Workflow Files

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

**Purpose:** Run linter, type checks, and build on every push and pull request.

**Triggers:** 
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**
1. Checks out code
2. Sets up Node.js 20
3. Installs dependencies with npm cache
4. Runs ESLint
5. Builds Next.js application

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Build Next.js application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: next-build-${{ github.run_id }}
          path: .next
          retention-days: 5
```

---

### 2. **Database Migrations Workflow** (`.github/workflows/db-migrations.yml`)

**Purpose:** Automatically apply Supabase database migrations when migration files are updated.

**Triggers:**
- Push to `main` branch
- Only when files in `supabase/migrations/` are modified

**What it does:**
1. Checks out code
2. Sets up Supabase CLI
3. Applies pending migrations to Supabase

```yaml
name: Database Migrations

on:
  push:
    branches: [main]
    paths:
      - 'supabase/migrations/**'
      - '.github/workflows/db-migrations.yml'

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Link Supabase project
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_ID }} \
            --password ${{ secrets.SUPABASE_DB_PASSWORD }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      
      - name: Apply migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

### 3. **Deployment Workflow** (`.github/workflows/deploy.yml`)

**Purpose:** Deploy to VPS/production server after successful build.

**Triggers:**
- Push to `main` branch (only)

**What it does:**
1. Checks out code
2. Runs CI checks (lint and build)
3. Deploys to VPS via SSH
4. Restarts application using PM2

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            cd /var/www/church-app
            git pull origin main
            npm ci
            npm run build
            pm2 restart church-app || pm2 start npm --name church-app -- start
```

---

### 4. **Docker Build & Push** (`.github/workflows/docker-build.yml`)

**Purpose:** Build and push Docker image to Docker Hub (Optional, for containerized deployment).

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/church-app:latest
            ${{ secrets.DOCKER_USERNAME }}/church-app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## Implementation Steps

### Step 1: Create Workflow Directory

```bash
mkdir -p .github/workflows
```

### Step 2: Create Workflow Files

Create each `.yml` file in the `.github/workflows/` directory using the content provided above.

### Step 3: Configure GitHub Secrets

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add all required secrets from the [GitHub Secrets Configuration](#github-secrets-configuration) section

### Step 4: Generate SSH Key for VPS Deployment (if using deploy.yml)

On your local machine:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/church-app-deploy

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/church-app-deploy.pub user@your-vps-ip

# Add private key to GitHub Secrets
cat ~/.ssh/church-app-deploy
```

Then paste the private key content into the `VPS_SSH_KEY` secret.

### Note: Application Port

This project runs on port `3330` by default. The `package.json` scripts have been updated to start the dev and production servers on port `3330`.

When deploying to a VPS, ensure your server's firewall allows inbound traffic on port `3330` or configure a reverse proxy (Nginx) to forward requests from port `80`/`443` to `3330`.

### Step 5: Commit and Push

```bash
git add .github/
git commit -m "chore: add GitHub Actions CI/CD workflows"
git push origin main
```

---

## Workflow Descriptions

### CI Workflow Behavior

| Event | Trigger | Action |
|-------|---------|--------|
| Push to `main` or `develop` | Automatic | Run lint, type check, build |
| Pull Request to `main` or `develop` | Automatic | Run lint, type check, build |
| Manual Trigger | GitHub UI (Actions tab) | Run workflow |

**Success Criteria:**
- ✅ ESLint passes without errors
- ✅ TypeScript compiles without errors
- ✅ Next.js build completes successfully

### Database Migrations Behavior

| Event | Trigger | Action |
|-------|---------|--------|
| Push to `main` with migration file changes | Automatic | Apply migrations to Supabase |

### Deployment Behavior

| Event | Trigger | Action |
|-------|---------|--------|
| Push to `main` (after CI passes) | Automatic | Build and deploy to VPS |

---

## Monitoring Workflows

### View Workflow Runs

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select a workflow to see runs
4. Click on a run to see detailed logs

### Check Workflow Status

- **Green checkmark (✅)**: Workflow completed successfully
- **Red X (❌)**: Workflow failed
- **Yellow dot (⏳)**: Workflow in progress

### View Detailed Logs

1. Click on a workflow run
2. Click on the job name (e.g., `lint-and-build`)
3. View step-by-step logs

---

## Branch Protection Rules (Recommended)

To enforce CI checks before merging:

1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Enter branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Select `lint-and-build` as required check
5. Click **Create**

---

## Troubleshooting

### Build Fails with "Module not found"

**Issue:** ESLint or build step fails with missing dependencies

**Solution:**
```bash
npm install
npm run build
```

Push changes and retry workflow.

### Secrets Not Accessible in Workflow

**Issue:** Workflow fails with "secret is undefined"

**Solution:**
- Verify secret name exactly matches reference in workflow (case-sensitive)
- Ensure secret is added to the correct repository (not organization level)
- Secrets are not automatically available to pull requests from forks

### SSH Deployment Fails

**Issue:** "Permission denied" or "Connection refused"

**Solution:**
1. Verify VPS credentials are correct
2. Ensure SSH key has correct permissions: `chmod 600 ~/.ssh/church-app-deploy`
3. Test SSH connection locally first: `ssh -i ~/.ssh/church-app-deploy user@host`
4. Check VPS firewall allows SSH on port 22

### Supabase Migration Fails

**Issue:** "Project not found" or "Invalid token"

**Solution:**
- Verify `SUPABASE_PROJECT_ID` is correct (alphanumeric ID, not project name)
- Ensure `SUPABASE_ACCESS_TOKEN` is valid and not expired
- Check `SUPABASE_DB_PASSWORD` matches your database password

---

## Best Practices

### ✅ Do's

- **Use `npm ci` instead of `npm install`** - More reliable in CI environments
- **Cache dependencies** - Use actions/setup-node with cache for faster builds
- **Restrict deployment to main branch** - Avoid accidental deployments
- **Use environment variables for secrets** - Never hardcode sensitive data
- **Test locally before pushing** - Run `npm run lint` and `npm run build` locally first
- **Use branch protection rules** - Require CI checks before merging
- **Review workflow logs** - Check Actions tab for any warnings or issues
- **Set retention periods** - Clean up old artifacts to save storage

### ❌ Don'ts

- **Don't commit secrets** - Use GitHub Secrets instead
- **Don't use `master` branch for deployment** - Use `main` (already configured)
- **Don't run expensive operations repeatedly** - Use caching and artifacts
- **Don't ignore workflow failures** - Fix CI failures before merging
- **Don't store credentials in code** - Use environment variables
- **Don't skip security checks** - Keep GitHub Actions and dependencies updated

---

## Environment-Specific Configuration

### Development Environment

The CI workflow runs on all pushes and PRs to `develop` branch. No deployment occurs.

### Production Environment

The deploy workflow only runs on `main` branch after successful CI checks.

---

## Monitoring and Notifications

### Email Notifications (Default)

GitHub automatically sends email notifications for:
- Workflow failure on your branch
- Successful deployment (if configured)

### Custom Notifications

Consider adding Slack integration:

```yaml
- name: Send Slack notification
  if: failure()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Workflow failed: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
      }
```

---

## Next Steps

1. ✅ Create `.github/workflows/` directory
2. ✅ Add CI workflow (`ci.yml`)
3. ✅ Configure GitHub Secrets
4. ✅ Test CI workflow on next push
5. ✅ Add deployment workflow (optional)
6. ✅ Configure branch protection rules
7. ✅ Monitor workflow runs in Actions tab

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions for Node.js](https://docs.github.com/en/actions/guides/building-and-testing-nodejs)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli/usage)
- [Next.js Build Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

---

**Last Updated:** January 3, 2026  
**Version:** 1.0
