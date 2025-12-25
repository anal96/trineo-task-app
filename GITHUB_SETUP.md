# Push to GitHub - Step by Step Guide

## Prerequisites

### 1. Install Git (if not installed)
- Download: https://git-scm.com/download/win
- Or use winget: `winget install Git.Git`
- Restart terminal after installation

### 2. Create GitHub Account
- Go to: https://github.com
- Sign up if you don't have an account

## Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open PowerShell in your project directory and run:

```powershell
# Initialize git repository
git init

# Check status
git status
```

### Step 2: Verify .gitignore is Working

Your `.gitignore` file is already set up correctly and will exclude:
- ✅ `.env` (your MongoDB credentials - IMPORTANT!)
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ Log files
- ✅ Other sensitive files

**VERIFY:** Make sure `.env` is NOT tracked:
```powershell
git status
# You should NOT see .env in the list
```

### Step 3: Add Files to Git

```powershell
# Add all files (respecting .gitignore)
git add .

# Check what will be committed
git status
```

### Step 4: Create Initial Commit

```powershell
git commit -m "Initial commit: Trineo Tasks Mobile App"
```

### Step 5: Create GitHub Repository

1. Go to https://github.com
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `trineo-tasks-app` (or your preferred name)
4. Description: "Trineo Tasks Mobile App - Task Management Application"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

### Step 6: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify remote was added
git remote -v
```

### Step 7: Push to GitHub

```powershell
# Push to GitHub (first time)
git branch -M main
git push -u origin main
```

You'll be prompted for GitHub credentials:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your GitHub password)

### Step 8: Create Personal Access Token (if needed)

If GitHub asks for a token:

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Name: `trineo-tasks-push`
4. Select scopes: Check **repo** (full control)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

## Quick Command Summary

```powershell
# 1. Initialize
git init

# 2. Add files
git add .

# 3. Commit
git commit -m "Initial commit: Trineo Tasks Mobile App"

# 4. Add remote (replace with your details)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 5. Push
git branch -M main
git push -u origin main
```

## Security Checklist Before Pushing

Before pushing, make sure these are in `.gitignore` (they already are):

- ✅ `.env` - Contains MongoDB credentials and JWT secret
- ✅ `node_modules/` - Dependencies (too large)
- ✅ `dist/` - Build files (can be regenerated)
- ✅ `*.log` - Log files

**VERIFY:** Run this to check:
```powershell
git status
# Make sure .env is NOT listed!
```

## After Pushing

### Update README.md

Consider updating your README.md with:
- Project description
- Setup instructions
- Deployment guide link

### Add Repository Topics (on GitHub)

After pushing, add topics to your repo:
- `task-management`
- `react`
- `mongodb`
- `pwa`
- `mobile-app`

## Future Updates

For future changes:

```powershell
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Commit
git commit -m "Description of changes"

# 4. Push
git push
```

## Troubleshooting

### Error: "fatal: not a git repository"
**Solution:** Run `git init` first

### Error: "remote origin already exists"
**Solution:** 
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Error: "authentication failed"
**Solution:** Use Personal Access Token instead of password

### Error: "refusing to merge unrelated histories"
**Solution:**
```powershell
git pull origin main --allow-unrelated-histories
```

## Alternative: Using GitHub Desktop

If you prefer a GUI:

1. Download: https://desktop.github.com/
2. Install and sign in
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish repository" button

## Important Notes

⚠️ **NEVER commit `.env` file!**
- It contains sensitive credentials
- Already in `.gitignore` ✅
- If accidentally committed, see: https://help.github.com/articles/removing-sensitive-data-from-a-repository

✅ **Safe to commit:**
- Source code
- Configuration files (except .env)
- Documentation
- Package.json

## Next Steps After Pushing

1. **Set up GitHub Actions** (optional) for CI/CD
2. **Add a license** (MIT, Apache, etc.)
3. **Create releases** for version tags
4. **Set up branch protection** (for production)

---

**Need help?** Check GitHub documentation: https://docs.github.com

