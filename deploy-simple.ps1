#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Habit Tracker Deployment Automation
.DESCRIPTION
    Guides you through Supabase, GitHub, and Vercel setup
#>

# Setup
$Colors = @{ Success = 'Green'; Error = 'Red'; Warning = 'Yellow'; Info = 'Cyan' }

function Write-Log {
    param([string]$Msg, [string]$Type = 'Info')
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] $Msg" -ForegroundColor $Colors[$Type]
}

function Ask {
    param([string]$Q, [switch]$Required)
    $v = Read-Host $Q
    if ($Required -and -not $v) { return Ask -Q $Q -Required }
    return $v
}

# PHASE 1: CREDENTIALS
Write-Log "===== HABIT TRACKER DEPLOYMENT =====" Info
Write-Host ""
Write-Log "PHASE 1: SUPABASE CREDENTIALS" Info
Write-Host ""
Write-Host "Go to https://supabase.com/dashboard"
Write-Host "Go to: Your Project > Settings > API"
Write-Host ""

$url = Ask "Supabase URL (https://xxx.supabase.co)" -Required
$anonKey = Ask "Anon key" -Required
$srvKey = Ask "Service role key" -Required
$dbPass = Ask "Database password" -Required

# PHASE 2: ENV FILE
Write-Log "PHASE 2: CREATE .env.local" Info
Write-Host ""

@"
VITE_SUPABASE_URL=$url
VITE_SUPABASE_ANON_KEY=$anonKey
"@ | Set-Content .env.local

Write-Log "Created .env.local" Success

# PHASE 3: BUILD TEST
Write-Log "PHASE 3: TEST BUILD" Info
Write-Host ""

if ((npm run build 2>&1 | Select-Object -Last 1) -match "built") {
    Write-Log "Build OK" Success
} else {
    Write-Log "Build failed" Error
    exit
}

# PHASE 4: SUPABASE SCHEMA
Write-Log "PHASE 4: DEPLOY SUPABASE SCHEMA" Info
Write-Host ""
Write-Host "Option 1: npx supabase db push"
Write-Host "Option 2: Go to Supabase > SQL Editor > copy supabase/migrations/001_initial_schema.sql"
Write-Host ""
$deployed = Ask "Done deploying schema?" 
if ("$deployed" -ne "yes") { exit }

# PHASE 5: GIT PUSH
Write-Log "PHASE 5: GITHUB SETUP" Info
Write-Host ""
Write-Host "Create repo at https://github.com/new"
Write-Host "Name: habit-tracker (do NOT init with files)"
Write-Host ""

$repoUrl = Ask "GitHub repo URL (https://github.com/USERNAME/habit-tracker.git)" -Required

git add .
git commit -m "Setup: Supabase + env config"
git branch -M main
git remote add origin $repoUrl
git push -u origin main

Write-Log "Pushed to GitHub" Success

# PHASE 6: SECRETS
Write-Log "PHASE 6: GITHUB SECRETS" Info
Write-Host ""
Write-Host "Go to: GitHub repo > Settings > Secrets and variables > Actions"
Write-Host "Add each (click New repository secret):"
Write-Host ""
Write-Host "1. VITE_SUPABASE_URL = $url"
Write-Host "2. VITE_SUPABASE_ANON_KEY = (copy from above)"
Write-Host "3. SUPABASE_URL = $url"
Write-Host "4. SUPABASE_SERVICE_ROLE_KEY = (service role key)"
Write-Host "5. SUPABASE_DB_PASSWORD = (database password)"
Write-Host ""
Write-Host "Later (after Vercel):"
Write-Host "6. VERCEL_TOKEN (from https://vercel.com/account/tokens)"
Write-Host "7. VERCEL_ORG_ID (from Vercel dashboard)"
Write-Host "8. VERCEL_PROJECT_ID (from Vercel dashboard)"
Write-Host ""

$ok = Ask "Added first 5 secrets?"
if ("$ok" -ne "yes") { exit }

# PHASE 7: VERCEL
Write-Log "PHASE 7: VERCEL DEPLOYMENT" Info
Write-Host ""
Write-Host "1. Go to https://vercel.com/dashboard"
Write-Host "2. Add Project > Import from Git"
Write-Host "3. Select your GitHub repo > Import"
Write-Host "4. Wait for deployment > Done"
Write-Host ""

$vercelDone = Ask "Deployed to Vercel?"
if ("$vercelDone" -ne "yes") { exit }

Write-Host ""
Write-Host "Now get Vercel credentials:"
Write-Host "1. Create token: https://vercel.com/account/tokens"
Write-Host "2. Dashboard > Your Project > Settings > General"
Write-Host ""

$token = Ask "VERCEL_TOKEN" -Required
$orgId = Ask "VERCEL_ORG_ID" -Required
$projId = Ask "VERCEL_PROJECT_ID" -Required

Write-Host ""
Write-Host "Add to GitHub secrets:"
Write-Host "6. VERCEL_TOKEN = $($token.Substring(0, 10))..."
Write-Host "7. VERCEL_ORG_ID = $orgId"
Write-Host "8. VERCEL_PROJECT_ID = $projId"
Write-Host ""

$secretsDone = Ask "Added all 8 secrets?"
if ("$secretsDone" -ne "yes") { exit }

# PHASE 8: FINAL
Write-Log "PHASE 8: TRIGGER CI/CD" Info
Write-Host ""

git add .
git commit -m "Deploy: All secrets configured"
git push

Write-Host ""
Write-Log "DEPLOYMENT COMPLETE!" Success
Write-Host ""
Write-Host "Check progress at:"
Write-Host "- GitHub: $repoUrl/actions"
Write-Host "- Vercel: https://vercel.com/dashboard"
Write-Host ""
Write-Log "Your app is live! Enjoy! 🎉" Success
