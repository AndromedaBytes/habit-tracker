# 🚀 Deployment Action Checklist

Complete these steps in order to deploy your app to production.

## Phase 1: Preparation (5 minutes)

- [ ] Get Supabase credentials from [Supabase Dashboard](https://supabase.com/dashboard)
  - [ ] Copy Project URL (e.g., `https://xxxxx.supabase.co`)
  - [ ] Copy anon key
  - [ ] Copy service role key
  - [ ] Copy database password
  - [ ] Store these safely

- [ ] Fill in `.env.local` with your Supabase credentials:
  ```
  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
  VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
  ```

- [ ] Test locally:
  ```bash
  npm run dev
  ```

---

## Phase 2: Database Setup (2 minutes)

**Choose ONE option:**

### Option A: Using CLI (Recommended)
- [ ] Run: `npx supabase db push`
- [ ] Verify: Go to Supabase Dashboard → should see 10 new tables

### Option B: Using Dashboard
- [ ] Open [Supabase SQL Editor](https://supabase.com/dashboard)
- [ ] Create new query
- [ ] Copy contents of `supabase/migrations/001_initial_schema.sql`
- [ ] Run the SQL
- [ ] Verify: 10 tables appear in Table Editor

---

## Phase 3: GitHub Setup (5 minutes)

- [ ] Create new repository on [GitHub](https://github.com)
  - Name: `habit-tracker`
  - **Don't** initialize with README/gitignore/license
  - Copy the repository URL

- [ ] Push code to GitHub:
  ```bash
  git add .
  git commit -m "Initial commit: Habit tracker with Supabase & Vercel"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
  git push -u origin main
  ```

---

## Phase 4: GitHub Secrets Setup (10 minutes)

Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**

Add each secret by clicking **New repository secret**:

1. [ ] `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
2. [ ] `VITE_SUPABASE_ANON_KEY` = (from Supabase Settings → API)
3. [ ] `SUPABASE_URL` = (same as #1)
4. [ ] `SUPABASE_SERVICE_ROLE_KEY` = (from Supabase Settings → API)
5. [ ] `SUPABASE_DB_PASSWORD` = (from Supabase Settings → Database)
6. [ ] `VERCEL_TOKEN` = (create at https://vercel.com/account/tokens)
7. [ ] `VERCEL_ORG_ID` = (from Vercel Dashboard → Project → Settings → General)
8. [ ] `VERCEL_PROJECT_ID` = (from Vercel Dashboard → Project → Settings → General)

**Detail guide:** See `.github/SETUP_GITHUB_SECRETS.md`

---

## Phase 5: Vercel Setup (5 minutes)

1. [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Click **Add New** → **Project**
3. [ ] Select your GitHub repository
4. [ ] Click **Import**
5. [ ] Vercel auto-detects Vite config
6. [ ] Click **Deploy**
7. [ ] Wait for deployment to complete

**After deployment:**
8. [ ] Note the deployment URL (e.g., `https://habit-tracker-xxx.vercel.app`)
9. [ ] Go to **Settings** → **General**
10. [ ] Copy **Project ID** → Add to GitHub as `VERCEL_PROJECT_ID`
11. [ ] Copy **Org ID** → Add to GitHub as `VERCEL_ORG_ID`

---

## Phase 6: Final Deployment (2 minutes)

- [ ] Trigger workflow by pushing to main:
  ```bash
  git add .
  git commit -m "Enable CI/CD: Complete deployment setup"
  git push origin main
  ```

- [ ] Go to GitHub → **Actions** tab
  - [ ] Wait for workflow to complete (lint → test → build → deploy)
  - [ ] All checks should be ✅

- [ ] Visit your Vercel deployment URL
  - [ ] App loads successfully
  - [ ] Click "Send Magic Link" to test auth
  - [ ] Should work end-to-end ✅

---

## ✨ You're Done!

Your app is now live in production with:
- ✅ Frontend on Vercel (auto-deploys on push to main)
- ✅ Backend on Supabase (Postgres + Auth + Realtime)
- ✅ CI/CD pipeline (GitHub Actions auto-tests & deploys)
- ✅ Database migrations (auto-applied on schema changes)

### Next Steps:
- Create feature branches to experiment
- Push to `main` for production deployments
- Share your app URL with users!

---

## Need Help?

- **Full guide:** See `SETUP.md` in project root
- **GitHub secrets details:** See `.github/SETUP_GITHUB_SECRETS.md`
- **Vercel logs:** https://vercel.com/dashboard
- **Supabase logs:** https://supabase.com/dashboard

Good luck! 🚀
