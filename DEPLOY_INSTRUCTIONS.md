# Deployment Instructions

Your project is ready for deployment. Follow these steps to connect Supabase and Vercel.

## 1. Supabase Configuration
We are using your existing Supabase project **"Life OS"**.

- **Project URL**: `https://iswktypipioiuygeapda.supabase.co`
- **Anon Key**: Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/iswktypipioiuygeapda/settings/api) and copy the `anon` key.

### Local Development
I have created a `.env` file for you. Please open it and paste your `anon` key:
```bash
VITE_SUPABASE_URL=https://iswktypipioiuygeapda.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_key_here
```

## 2. Vercel Configuration
You need to set up the environment variables in your Vercel project so the build can access Supabase.

1.  Go to your Vercel Project Settings > **Environment Variables**.
2.  Add the following variables:
    *   `VITE_SUPABASE_URL`: `https://iswktypipioiuygeapda.supabase.co`
    *   `VITE_SUPABASE_ANON_KEY`: (Your `anon` key from Step 1)

## 3. GitHub Actions (Automated Deployment)
To enable the automated deployment workflow (`.github/workflows/deploy.yml`), you need to add secrets to your GitHub repository.

1.  Go to your GitHub Repo > **Settings** > **Secrets and variables** > **Actions**.
2.  Add the following **Repository Secrets**:
    *   `VERCEL_TOKEN`: Create this in your Vercel Account Settings (Tokens).
    *   `VERCEL_ORG_ID`: Found in Vercel Team Settings.
    *   `VERCEL_PROJECT_ID`: Found in Vercel Project Settings (under General).
    
    *Optional (if you want the GitHub Action to also run tests/checks with access to DB):*
    *   `VITE_SUPABASE_URL`: `https://iswktypipioiuygeapda.supabase.co`
    *   `VITE_SUPABASE_ANON_KEY`: (Your `anon` key)

## 4. Deploy!
Once the secrets are set, push your changes to the `main` branch:

```bash
git push origin main
```

This will trigger the GitHub Action, which will build your project using the Vercel secrets and deploy it.
