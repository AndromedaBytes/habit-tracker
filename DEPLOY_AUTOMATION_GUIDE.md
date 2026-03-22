# 🚀 Automated Deployment Script

This directory contains automated scripts to handle the entire deployment process with minimal manual steps.

## Quick Start

### Windows (PowerShell)
```powershell
# Enable script execution (one-time)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run deployment script
.\deploy.ps1
```

### macOS / Linux / WSL
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## What the Script Does

The deployment script automates all 8 phases in order:

### Phase 1: Collect Credentials
- Prompts for Supabase credentials (Project URL, anon key, service role key, DB password)
- Validates that you've created a Supabase project

### Phase 2: Configure Environment
- Creates `.env.local` with your Supabase credentials
- Secrets are stored locally for development

### Phase 3: Test Local Development
- Runs `npm run build` to verify setup
- Confirms your credentials work before proceeding

### Phase 4: Deploy Supabase Schema
- **Option A**: Auto-deploy using Supabase CLI
- **Option B**: Manual deployment via Supabase Dashboard
- Creates 10 tables with RLS policies

### Phase 5: GitHub Setup
- Pushes code to your GitHub repository
- Creates initial git history

### Phase 6: GitHub Secrets
- Displays all secrets you need to add
- Walks you through GitHub Settings → Secrets interface
- Waits for confirmation before continuing

### Phase 7: Vercel Setup
- Guides you to Vercel Dashboard
- Helps you link repository and deploy
- Collects Vercel credentials (token, org ID, project ID)

### Phase 8: Final Deployment
- Triggers GitHub Actions CI/CD pipeline
- Displays status URLs for monitoring

---

## Required Before Running

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a free account
- Create a new project
- Copy credentials from Settings → API

### 2. Create a GitHub Account
- Go to [github.com](https://github.com)
- Create account (if needed)
- Have it ready — you'll need it during script execution

### 3. Create a Vercel Account
- Go to [vercel.com](https://vercel.com)
- Create free account
- Import from GitHub (during script)

### 4. Install Required Tools
```bash
# Node.js (required)
node --version  # Should be v18+

# Git (required)
git --version   # Should be installed

# GitHub CLI (optional but helpful)
gh --version    # For GitHub operations
```

---

## Step-by-Step Guide

### 1. **Run the Script**
   ```powershell
   .\deploy.ps1
   ```

### 2. **Gather Credentials**
   - The script will ask for Supabase credentials
   - Have Supabase dashboard open in browser
   - Copy-paste credentials when prompted

### 3. **Confirm Supabase Project**
   - Answer "yes" when asked if you have Supabase project

### 4. **Choose Schema Deployment Method**
   - **CLI**: Auto-deploys if you run linking commands (1)
   - **Dashboard**: Manually paste SQL in Supabase (2)

### 5. **Push to GitHub**
   - Script creates GitHub repository URL prompt
   - Paste your new repo URL (eg: `https://github.com/username/habit-tracker.git`)
   - Script auto-pushes code

### 6. **Add GitHub Secrets** (Manual Step)
   - Script lists all secrets you need
   - Go to GitHub → Settings → Secrets and variables → Actions
   - Click "New repository secret" for each one
   - **Important**: Do NOT close the script yet

### 7. **Deploy to Vercel** (Manual Step)
   - Go to Vercel Dashboard
   - Click "Add New" → "Project"
   - Select your GitHub repo
   - Click "Deploy"
   - Wait for completion

### 8. **Add Vercel Secrets** (Manual Step)
   - Copy Vercel token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Get Project ID and Org ID from Vercel Dashboard
   - Add to GitHub secrets

### 9. **Final Trigger**
   - Script pushes final commit which triggers GitHub Actions
   - Watch deployment in GitHub Actions tab
   - Visit Vercel deployment URL when done

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Script won't run on Windows | Enable scripts: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| "Git not found" | Install Git from https://git-scm.com |
| "npm not found" | Install Node.js from https://nodejs.org |
| "Invalid Supabase credentials" | Double-check URL and keys in Supabase dashboard |
| "Repository already exists" | Create repo with different name or use existing |
| GitHub Actions fails | Check all 8 secrets are added correctly in GitHub Settings |
| Vercel deploy fails | Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist in GitHub secrets |

---

## Recovery

If you close the script or encounter an error:

### Resume from specific phase:
Each phase is mostly independent. You can:
1. Fix the issue
2. Run the script again
3. Skip completed phases by answering "yes/no" appropriately

### Manual commands if needed:
```bash
# Commit and push manually
git add .
git commit -m "Deploy: Setup complete"
git push origin main

# Deploy Supabase schema manually
npx supabase db push

# Check GitHub Actions status
# Go to: GitHub Repo → Actions tab
```

---

## What's Next?

After successful deployment:

1. **Visit your live app**: URL from Vercel dashboard
2. **Test authentication**: Click "Send Magic Link"
3. **Monitor**: 
   - GitHub Actions: Repo → Actions tab
   - Vercel: https://vercel.com/dashboard
   - Supabase: https://supabase.com/dashboard
4. **Enable auto-deploys**: 
   - Push to `main` branch = automatic deployment
   - Create feature branches for PRs = automatic preview deploys

---

## Security Notes

- `.env.local` contains sensitive keys — **NEVER commit or share**
- GitHub secrets are encrypted and never displayed
- Supabase service role key should only be used in CI/CD (GitHub Actions)
- Use environment-specific secrets for production

---

## Questions or Issues?

If something goes wrong:
1. Check [SETUP.md](../SETUP.md) for detailed manual steps
2. Review [.github/SETUP_GITHUB_SECRETS.md](../.github/SETUP_GITHUB_SECRETS.md) for secrets reference
3. Check error messages — they usually indicate what's wrong
4. Review phase that failed and retry with correct values

Good luck! 🚀
