# Deployment Setup Guide

This guide walks you through deploying this Habit Tracker app to production with GitHub + Vercel + Supabase.

## Prerequisites
- GitHub account (free)
- Vercel account (free)
- Supabase project (free)

## Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

**Store these safely — you'll need them next.**

---

## Step 2: Create `.env.local` for Local Development

The `.env.local` file is already created in the project root. Fill it with your Supabase credentials:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Test locally:
```bash
npm run dev
```

---

## Step 3: Deploy Supabase Schema

Your database schema is ready in `supabase/migrations/001_initial_schema.sql`.

**Option A: Using Supabase CLI** (automatic)
```bash
npx supabase db push
```

**Option B: Using Supabase Dashboard** (manual)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **SQL Editor**
3. Click **New Query**
4. Copy entire contents from `supabase/migrations/001_initial_schema.sql`
5. Paste and click **RUN**

Verify: You should see 10 new tables in the **Table Editor**.

---

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click **New repository**
3. Name it `habit-tracker` (or your preferred name)
4. **Do NOT** initialize with README, .gitignore, or license
5. Click **Create repository**
6. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/habit-tracker.git`)

---

## Step 5: Push Code to GitHub

In your project directory:

```bash
git add .
git commit -m "Initial commit: Habit tracker with Supabase backend and Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
git push -u origin main
```

**Don't worry about errors yet** — you'll set up GitHub secrets next.

---

## Step 6: Configure GitHub Secrets

GitHub Actions workflows need secrets to deploy. Go to your GitHub repo:

1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add each:

### Required Secrets

| Secret Name | Value | Where to Find |
|---|---|---|
| `VITE_SUPABASE_URL` | https://xxxxx.supabase.co | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | your_anon_key | Supabase Dashboard → Settings → API |
| `VERCEL_TOKEN` | [see below] | See "Create Vercel Token" section |
| `VERCEL_ORG_ID` | [see below] | See "Link to Vercel" section |
| `VERCEL_PROJECT_ID` | [see below] | See "Link to Vercel" section |
| `SUPABASE_URL` | https://xxxxx.supabase.co | Supabase Dashboard → Settings → API (same as VITE_SUPABASE_URL) |
| `SUPABASE_SERVICE_ROLE_KEY` | your_service_role_key | Supabase Dashboard → Settings → API → **Service role key** |
| `SUPABASE_DB_PASSWORD` | [see below] | See "Get Database Password" section |

**Add each as a separate secret in GitHub.**

---

## Step 7: Create Vercel Token

1. Go to [Vercel Settings](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name it `github-actions` (optional)
4. Copy the token
5. In GitHub (from Step 6), add secret:
   - Name: `VERCEL_TOKEN`
   - Value: [paste token]

---

## Step 8: Link Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Click **Import**
5. Vercel will auto-detect Vite configuration
6. Click **Deploy**

**After deployment completes:**
1. Go to **Settings** → **General**
2. Copy **Project ID** and **Org ID**
3. In GitHub (from Step 6), add secrets:
   - Name: `VERCEL_PROJECT_ID`
   - Value: [paste from Vercel]
   - Name: `VERCEL_ORG_ID`
   - Value: [paste from Vercel]

---

## Step 9: Get Supabase Service Role Key & DB Password

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Settings** → **API**
3. Under **Keys**, copy:
   - **Service role key** (for `SUPABASE_SERVICE_ROLE_KEY` secret)
4. Go to **Settings** → **Database**
5. Under **Connection info**, find **Password**
   - Copy for `SUPABASE_DB_PASSWORD` secret

**Add as GitHub secrets (from Step 6)**

---

## Step 10: Enable GitHub Actions

1. Go to your GitHub repo
2. **Actions** tab
3. If workflow is disabled, click **I understand my workflows, go ahead and enable them**

---

## Step 11: Deploy!

Push a test commit to main:

```bash
git add .
git commit -m "Enable CI/CD: Add GitHub Actions and Vercel deploy"
git push origin main
```

**Watch it deploy:**
1. Go to GitHub repo → **Actions**
2. You should see workflow running
3. Once completed, go to your Vercel deployment URL

**Verify in production:**
- Load the app in your browser
- Click "Send Magic Link" to test authentication
- Should work end-to-end ✅

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Secret not found" error | Make sure secrets are added in GitHub Settings → Secrets |
| Deploy fails in Vercel | Check Vercel dashboard logs; ensure VITE_SUPABASE_* secrets are set |
| Database migration fails | Run `npx supabase db push` locally or manually run SQL in Supabase dashboard |
| App loads but can't authenticate | Check `.env.local` has correct Supabase credentials for local development |
| "RLS violation" errors | Confirm Supabase schema deployed (check 10 tables exist in Supabase dashboard) |

---

## Local Development

```bash
# Install dependencies
npm install

# Set up local Supabase (optional, for offline dev)
npx supabase start

# Start dev server
npm run dev

# Run tests
npm run test

# Type-check
npm run typecheck

# Build & preview production
npm run build
npm run preview
```

---

## What's Deployed?

✅ **Frontend** → Vercel (auto-rebuilds on push to main)
✅ **Backend** → Supabase (serverless Postgres + auth + realtime)
✅ **CI/CD** → GitHub Actions (lint → test → build → deploy)
✅ **Database Migrations** → Auto-applied on push to `supabase/migrations/`

---

## Next Steps

1. Add more features to your habit tracker
2. Push to `main` branch to auto-deploy
3. Create feature branches for development (auto-creates preview deployments)
4. Monitor logs in Vercel & Supabase dashboards

Enjoy! 🎉
