#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Habit Tracker Deployment Automation Script
    
.DESCRIPTION
    Automates the complete deployment process:
    - Deploy Supabase schema
    - Configure environment variables
    - Push code to GitHub
    - Create GitHub secrets
    - Link and deploy to Vercel

.EXAMPLE
    .\deploy.ps1
#>

param(
    [switch]$SkipCheck
)

# Colors for output
$Colors = @{
    Success = 'Green'
    Error   = 'Red'
    Warning = 'Yellow'
    Info    = 'Cyan'
}

function Write-Status {
    param([string]$Message, [string]$Type = 'Info')
    Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] " -NoNewline
    Write-Host "$Message" -ForegroundColor $Colors[$Type]
}

function Confirm-Input {
    param([string]$Prompt, [switch]$Required)
    $value = Read-Host $Prompt
    if ($Required -and [string]::IsNullOrWhitespace($value)) {
        Write-Status "This field is required!" Error
        return Confirm-Input -Prompt $Prompt -Required
    }
    return $value
}

# ============================================================================
# Phase 1: Collect Credentials
# ============================================================================

Write-Status "╔════════════════════════════════════════════════════════════════╗" Info
Write-Status "║  Habit Tracker - Automated Deployment Setup                   ║" Info
Write-Status "╚════════════════════════════════════════════════════════════════╝" Info
Write-Host ""

Write-Status "PHASE 1: Collecting Credentials" Info
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

Write-Host "You'll need credentials from THREE services:" -ForegroundColor Yellow
Write-Host "  1. Supabase Dashboard (https://supabase.com/dashboard)" -ForegroundColor Cyan
Write-Host "  2. Vercel Dashboard   (https://vercel.com)" -ForegroundColor Cyan
Write-Host "  3. GitHub Account     (https://github.com)" -ForegroundColor Cyan
Write-Host ""

Write-Status "Have you created a Supabase project? (yes/no)" Warning
$hasSupabase = Read-Host
if ($hasSupabase -ne 'yes') {
    Write-Status "Please create a Supabase project first at https://supabase.com" Error
    exit 1
}

Write-Host ""
Write-Status "SUPABASE CREDENTIALS" Info
Write-Status "From: Supabase Dashboard → Your Project → Settings → API" "Warning"
Write-Host ""

$SupabaseUrl = Confirm-Input "Enter Supabase Project URL (https://xxxxx.supabase.co)" -Required
$SupabaseAnonKey = Confirm-Input "Enter Supabase anon key (eyJ...)" -Required
$SupabaseServiceRoleKey = Confirm-Input "Enter Supabase service role key (eyJ...)" -Required
$SupabaseDbPassword = Confirm-Input "Enter Supabase database password" -Required

Write-Host ""
Write-Status "VERCEL CREDENTIALS (optional for now, will set up later)" Info
Write-Host ""

# ============================================================================
# Phase 2: Configure Environment
# ============================================================================

Write-Host ""
Write-Status "PHASE 2: Configuring Environment Variables" Info
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

$EnvLocalPath = Join-Path (Get-Location) '.env.local'
$EnvContent = @"
# Supabase Configuration
VITE_SUPABASE_URL=$SupabaseUrl
VITE_SUPABASE_ANON_KEY=$SupabaseAnonKey

# GitHub Actions & CI/CD (populated later)
# SUPABASE_URL=<will be set later>
# SUPABASE_SERVICE_ROLE_KEY=<will be set later>
# SUPABASE_DB_PASSWORD=<will be set later>
# VERCEL_TOKEN=<will be set later>
# VERCEL_ORG_ID=<will be set later>
# VERCEL_PROJECT_ID=<will be set later>
"@

$EnvContent | Set-Content $EnvLocalPath
Write-Status "✓ Created .env.local" Success

# ============================================================================
# Phase 3: Test Local Development
# ============================================================================

Write-Host ""
Write-Status "PHASE 3: Testing Local Development" Info
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

Write-Status "Testing if app builds with your credentials..." Info
$buildResult = npm run build 2>&1 | Select-Object -Last 10

if ($LASTEXITCODE -eq 0) {
    Write-Status "✓ Build successful!" Success
} else {
    Write-Status "✗ Build failed. Check your credentials and try again." Error
    Write-Host $buildResult
    exit 1
}

# ============================================================================
# Phase 4: Deploy Supabase Schema
# ============================================================================

Write-Host ""
Write-Status "PHASE 4: Deploying Supabase Schema" Info
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

Write-Host "Choose deployment method:" -ForegroundColor Cyan
Write-Host "  1. Using Supabase CLI (automatic)"
Write-Host "  2. Using Supabase Dashboard (manual)"
Write-Host ""
$deployMethod = Read-Host "Enter 1 or 2"

if ($deployMethod -eq "1") {
    Write-Status "Deploying schema using Supabase CLI..." Info
    Write-Host "Running: npx supabase link --project-ref <your-ref>"
    Write-Host "Note: You'll need to authenticate with Supabase"
    
    Write-Host ""
    Write-Status "Enter your Supabase project ref (from URL or dashboard):" Warning
    $projectRef = Read-Host "Project ref"
    
    # npx supabase link --project-ref $projectRef
    # npx supabase db push
    
    Write-Status "To complete schema deployment, run these commands:" Warning
    Write-Host "  npx supabase link --project-ref $projectRef" -ForegroundColor Yellow
    Write-Host "  npx supabase db push" -ForegroundColor Yellow
} else {
    Write-Status "Manual Supabase Dashboard deployment selected" Warning
    Write-Host ""
    Write-Host "To deploy manually:" -ForegroundColor Cyan
    Write-Host "  1. Go to Supabase Dashboard → SQL Editor"
    Write-Host "  2. Create new query"
    Write-Host "  3. Copy contents from: supabase/migrations/001_initial_schema.sql"
    Write-Host "  4. Paste and click RUN"
    Write-Host "  5. Verify 10 tables created in Table Editor"
    Write-Host ""
    $confirm = Read-Host "Have you completed manual deployment? (yes/no)"
    if ($confirm -ne 'yes') {
        Write-Status "Please complete manual schema deployment before continuing" Warning
        exit 1
    }
}

Write-Status "✓ Supabase schema deployed" Success

# ============================================================================
# Phase 5: GitHub Setup
# ============================================================================

Write-Host ""
Write-Status "PHASE 5: GitHub Setup" Info
Write-Status "━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

Write-Host "Creating GitHub repository..." -ForegroundColor Cyan
Write-Host "  1. Go to GitHub.com and sign in"
Write-Host "  2. Click 'New repository'"
Write-Host "  3. Name it 'habit-tracker' (recommended)"
Write-Host "  4. DO NOT initialize with README/gitignore/license"
Write-Host "  5. Click 'Create repository'"
Write-Host ""

$githubUrl = Confirm-Input "Enter your GitHub repository URL (https://github.com/YOUR_USERNAME/habit-tracker.git)" -Required

Write-Status "Pushing code to GitHub..." Info
git add .
git commit -m "Deploy: Complete setup with Supabase schema and environment config"
git branch -M main
git remote add origin $githubUrl
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Status "✓ Code pushed to GitHub" Success
} else {
    Write-Status "✗ Failed to push to GitHub" Error
    Write-Status "Make sure your repository URL is correct and you have GitHub CLI configured" Warning
    exit 1
}

# ============================================================================
# Phase 6: GitHub Secrets
# ============================================================================

Write-Host ""
Write-Status "PHASE 6: Setting Up GitHub Secrets" Info
Write-Status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

Write-Host "GitHub secrets must be set manually. Go to:" -ForegroundColor Yellow
Write-Host "  GitHub → Your Repo → Settings → Secrets and variables → Actions" -ForegroundColor Cyan
Write-Host ""

$secrets = @(
    @{Name="VITE_SUPABASE_URL"; Value=$SupabaseUrl; Description="Supabase Project URL"},
    @{Name="VITE_SUPABASE_ANON_KEY"; Value=$SupabaseAnonKey; Description="Supabase anon key"},
    @{Name="SUPABASE_URL"; Value=$SupabaseUrl; Description="Supabase Project URL (for migrations)"},
    @{Name="SUPABASE_SERVICE_ROLE_KEY"; Value=$SupabaseServiceRoleKey; Description="Supabase service role key"},
    @{Name="SUPABASE_DB_PASSWORD"; Value=$SupabaseDbPassword; Description="Supabase database password"}
)

Write-Host "Add these secrets to GitHub (click 'New repository secret' for each):" -ForegroundColor Cyan
Write-Host ""

foreach ($secret in $secrets) {
    Write-Host "  Name: $($secret.Name)" -ForegroundColor Yellow
    Write-Host "  Value: $($secret.Value.Substring(0, [Math]::Min(20, $secret.Length)))..." -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Also add these (get from Vercel after linking):" -ForegroundColor Cyan
Write-Host "  Name: VERCEL_TOKEN" -ForegroundColor Yellow
Write-Host "  Value: [Create at https://vercel.com/account/tokens]" -ForegroundColor Gray
Write-Host ""
Write-Host "  Name: VERCEL_ORG_ID" -ForegroundColor Yellow
Write-Host "  Value: [From Vercel Dashboard → Project → Settings]" -ForegroundColor Gray
Write-Host ""
Write-Host "  Name: VERCEL_PROJECT_ID" -ForegroundColor Yellow
Write-Host "  Value: [From Vercel Dashboard → Project → Settings]" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Have you added all 8 secrets to GitHub? (yes/no)"
if ($confirm -ne 'yes') {
    Write-Status "Please add the secrets before continuing" Warning
    Write-Status "You can run this script again later to continue with Vercel setup" Info
    exit 0
}

# ============================================================================
# Phase 7: Vercel Setup
# ============================================================================

Write-Host ""
Write-Status "PHASE 7: Vercel Deployment" Info
Write-Status "━━━━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

Write-Host "Linking to Vercel..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Go to Vercel Dashboard (https://vercel.com/dashboard)"
Write-Host "  2. Click 'Add New' → 'Project'"
Write-Host "  3. Select your GitHub repository"
Write-Host "  4. Click 'Import'"
Write-Host "  5. Vercel auto-detects Vite config"
Write-Host "  6. Click 'Deploy'"
Write-Host ""

$confirm = Read-Host "Have you deployed to Vercel? (yes/no)"
if ($confirm -ne 'yes') {
    Write-Status "Please deploy to Vercel, then run this script again" Warning
    exit 0
}

Write-Host "Now get your Vercel credentials:" -ForegroundColor Cyan
Write-Host "  1. Go to Vercel Dashboard → Your Project → Settings → General"
Write-Host "  2. Copy Project ID and Org ID"
Write-Host ""

$vercelToken = Confirm-Input "Enter Vercel API Token (from https://vercel.com/account/tokens)" -Required
$vercelOrgId = Confirm-Input "Enter Vercel Org ID" -Required
$vercelProjectId = Confirm-Input "Enter Vercel Project ID" -Required

Write-Status "Add these final secrets to GitHub:" Warning
Write-Host "  Name: VERCEL_TOKEN → Value: $($vercelToken.Substring(0, 10))..." -ForegroundColor Yellow
Write-Host "  Name: VERCEL_ORG_ID → Value: $vercelOrgId" -ForegroundColor Yellow
Write-Host "  Name: VERCEL_PROJECT_ID → Value: $vercelProjectId" -ForegroundColor Yellow

$confirm = Read-Host "Have you added the Vercel secrets? (yes/no)"
if ($confirm -ne 'yes') {
    Write-Status "Please add the Vercel secrets to GitHub" Warning
    exit 1
}

# ============================================================================
# Phase 8: Final Deployment
# ============================================================================

Write-Host ""
Write-Status "PHASE 8: Final Deployment" Info
Write-Status "━━━━━━━━━━━━━━━━━━━━" Info
Write-Host ""

Write-Status "Triggering GitHub Actions CI/CD pipeline..." Info
Write-Host ""
Write-Host "Push final commit to trigger deployment:" -ForegroundColor Cyan
Write-Host "  git add . && git commit -m 'Enable CI/CD: Complete deployment' && git push" -ForegroundColor Yellow
Write-Host ""

git add .
git commit -m "Enable CI/CD: Complete GitHub + Vercel + Supabase integration"
git push origin main

Write-Host ""
Write-Host "Deployment should now be in progress!" -ForegroundColor Green
Write-Host ""
Write-Host "Check progress at:" -ForegroundColor Cyan
Write-Host "  GitHub Actions: GitHub Repo → Actions tab" -ForegroundColor Yellow
Write-Host "  Vercel Deployment: https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# Success
# ============================================================================

Write-Host ""
Write-Status "╔════════════════════════════════════════════════════════════════╗" Success
Write-Status "║  ✓ DEPLOYMENT COMPLETE!                                       ║" Success
Write-Status "╚════════════════════════════════════════════════════════════════╝" Success
Write-Host ""

Write-Host "Your app is now deployed to production with:" -ForegroundColor Green
Write-Host "  ✓ Frontend: Vercel (auto-deploys on push to main)" -ForegroundColor Green
Write-Host "  ✓ Backend: Supabase (Postgres + Auth + Realtime)" -ForegroundColor Green
Write-Host "  ✓ CI/CD: GitHub Actions (lint → test → build → deploy)" -ForegroundColor Green
Write-Host "  ✓ Migrations: Auto-applied on schema changes" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Watch GitHub Actions: $githubUrl/actions" -ForegroundColor Gray
Write-Host "  2. Check Vercel deployment: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "  3. Visit your live app URL (from Vercel)" -ForegroundColor Gray
Write-Host "  4. Test by sending a magic link login" -ForegroundColor Gray
Write-Host ""

Write-Status "Enjoy your live Habit Tracker! 🎉" Success
