# GitHub Secrets Setup

Quick reference for setting up GitHub repository secrets for CI/CD deployment.

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter **Name** and **Value** for each secret below
5. Click **Add secret**

---

## Required Secrets Checklist

Copy-paste each name and follow the instructions to find the value:

### 1. `VITE_SUPABASE_URL`
- **Value**: Your Supabase project URL
- **Where to find**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project URL
- **Example**: `https://abcdef123456.supabase.co`

### 2. `VITE_SUPABASE_ANON_KEY`
- **Value**: Supabase anon (public) key
- **Where to find**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → anon (public)
- **Example**: `eyJhbGc...` (long string)

### 3. `SUPABASE_URL`
- **Value**: Same as `VITE_SUPABASE_URL`
- **Where to find**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project URL

### 4. `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Supabase service role key (for backend migrations)
- **Where to find**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → **Service role** (scroll down)
- **⚠️ SENSITIVE**: Keep this secret; never expose in frontend code

### 5. `SUPABASE_DB_PASSWORD`
- **Value**: Your Supabase database password
- **Where to find**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → Database → Connection info → **Password**
- **⚠️ SENSITIVE**: Keep this secret

### 6. `VERCEL_TOKEN`
- **Value**: Your Vercel API token
- **Where to find**: [Vercel Settings → Tokens](https://vercel.com/account/tokens) → Create Token
- **Steps**:
  1. Go to https://vercel.com/account/tokens
  2. Click **Create Token**
  3. Name it `github-actions` (optional)
  4. Click **Create**
  5. Copy the token (shown once)
- **⚠️ SENSITIVE**: Keep this secret

### 7. `VERCEL_ORG_ID`
- **Value**: Your Vercel Organization ID
- **Where to find**: [Vercel Dashboard](https://vercel.com) → Click your project → Settings → General → **Org ID**
- **Example**: `team_abc123def456`

### 8. `VERCEL_PROJECT_ID`
- **Value**: Your Vercel Project ID
- **Where to find**: [Vercel Dashboard](https://vercel.com) → Click your project → Settings → General → **Project ID**
- **Example**: `prj_abc123def456`

---

## Verification Checklist

After adding all 8 secrets, verify:

- [ ] All 8 secrets appear in GitHub Settings → Secrets
- [ ] No typos in secret names (case-sensitive!)
- [ ] No extra spaces in values
- [ ] `VITE_SUPABASE_*` keys match your Supabase project
- [ ] Vercel `TOKEN`, `ORG_ID`, `PROJECT_ID` match your Vercel account

---

## What These Secrets Do

| Secret | Used By | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | GitHub Actions → Build job | Initialize Supabase client in frontend |
| `VITE_SUPABASE_ANON_KEY` | GitHub Actions → Build job | Authenticate frontend requests to Supabase |
| `SUPABASE_URL` | GitHub Actions → DB migration job | Connect to Supabase for schema migrations |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Actions → DB migration job | Authenticate backend migration runner |
| `SUPABASE_DB_PASSWORD` | GitHub Actions → DB migration job | Direct database access for migrations |
| `VERCEL_TOKEN` | GitHub Actions → Deploy job | Authenticate deployment to Vercel |
| `VERCEL_ORG_ID` | GitHub Actions → Deploy job | Identify your Vercel organization |
| `VERCEL_PROJECT_ID` | GitHub Actions → Deploy job | Identify your Vercel project |

---

## After Setup

1. **Push code to main branch**:
   ```bash
   git push origin main
   ```

2. **Watch GitHub Actions** (repo → Actions tab):
   - Should run: `lint` → `test` → `build` → `deploy-production`
   - All should pass ✅

3. **Check Vercel** (https://vercel.com):
   - Deployment should be live
   - Click link to view your app

---

## Troubleshooting

| Error | Solution |
|---|---|
| "Secret not found" in logs | Add the missing secret to GitHub Settings → Secrets |
| "Invalid credentials" | Double-check secret values; copy-paste directly from dashboards |
| Deploy step skipped | Ensure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` are set |
| Build step failed | Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct |
| DB migration failed | Verify `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_DB_PASSWORD` in Supabase Settings |

---

For complete setup guide, see **[SETUP.md](../SETUP.md)** in project root.
