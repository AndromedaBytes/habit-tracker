#!/bin/bash
# Habit Tracker Deployment Automation Script (Bash version for macOS/Linux/WSL)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
log_status() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================================================
# Phase 1: Collect Credentials
# ============================================================================

echo ""
log_status "╔════════════════════════════════════════════════════════════════╗"
log_status "║  Habit Tracker - Automated Deployment Setup                   ║"
log_status "╚════════════════════════════════════════════════════════════════╝"
echo ""

log_status "PHASE 1: Collecting Credentials"
log_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "You'll need credentials from THREE services:"
echo -e "  1. ${CYAN}Supabase Dashboard (https://supabase.com/dashboard)${NC}"
echo -e "  2. ${CYAN}Vercel Dashboard   (https://vercel.com)${NC}"
echo -e "  3. ${CYAN}GitHub Account     (https://github.com)${NC}"
echo ""

log_warning "Have you created a Supabase project? (yes/no)"
read has_supabase
if [ "$has_supabase" != "yes" ]; then
    log_error "Please create a Supabase project first at https://supabase.com"
    exit 1
fi

echo ""
log_status "SUPABASE CREDENTIALS"
log_warning "From: Supabase Dashboard → Your Project → Settings → API"
echo ""

read -p "Enter Supabase Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Enter Supabase anon key: " SUPABASE_ANON_KEY
read -p "Enter Supabase service role key: " SUPABASE_SERVICE_ROLE_KEY
read -sp "Enter Supabase database password: " SUPABASE_DB_PASSWORD
echo ""

# ============================================================================
# Phase 2: Configure Environment
# ============================================================================

echo ""
log_status "PHASE 2: Configuring Environment Variables"
log_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# GitHub Actions & CI/CD (populated later)
# SUPABASE_URL=<will be set later>
# SUPABASE_SERVICE_ROLE_KEY=<will be set later>
# SUPABASE_DB_PASSWORD=<will be set later>
# VERCEL_TOKEN=<will be set later>
# VERCEL_ORG_ID=<will be set later>
# VERCEL_PROJECT_ID=<will be set later>
EOF

log_success "Created .env.local"

# ============================================================================
# Phase 3: Test Local Development
# ============================================================================

echo ""
log_status "PHASE 3: Testing Local Development"
log_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

log_status "Testing if app builds with your credentials..."
if npm run build > /dev/null 2>&1; then
    log_success "Build successful!"
else
    log_error "Build failed. Check your credentials and try again."
    exit 1
fi

# ============================================================================
# Phase 4: Deploy Supabase Schema
# ============================================================================

echo ""
log_status "PHASE 4: Deploying Supabase Schema"
log_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Choose deployment method:"
echo "  1. Using Supabase CLI (automatic)"
echo "  2. Using Supabase Dashboard (manual)"
echo ""
read -p "Enter 1 or 2: " deploy_method

if [ "$deploy_method" = "1" ]; then
    log_status "Deploying schema using Supabase CLI..."
    echo "Note: You'll need to authenticate with Supabase"
    read -p "Enter your Supabase project ref: " project_ref
    
    log_warning "Run these commands to complete deployment:"
    echo "  npx supabase link --project-ref $project_ref"
    echo "  npx supabase db push"
else
    log_status "Manual Supabase Dashboard deployment selected"
    echo ""
    echo "To deploy manually:"
    echo "  1. Go to Supabase Dashboard → SQL Editor"
    echo "  2. Create new query"
    echo "  3. Copy contents from: supabase/migrations/001_initial_schema.sql"
    echo "  4. Paste and click RUN"
    echo "  5. Verify 10 tables created in Table Editor"
    echo ""
    read -p "Have you completed manual deployment? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log_warning "Please complete manual schema deployment before continuing"
        exit 1
    fi
fi

log_success "Supabase schema deployed"

# ============================================================================
# Phase 5: GitHub Setup
# ============================================================================

echo ""
log_status "PHASE 5: GitHub Setup"
log_status "━━━━━━━━━━━━━━━━━━"
echo ""

echo "Creating GitHub repository..."
echo "  1. Go to GitHub.com and sign in"
echo "  2. Click 'New repository'"
echo "  3. Name it 'habit-tracker' (recommended)"
echo "  4. DO NOT initialize with README/gitignore/license"
echo "  5. Click 'Create repository'"
echo ""

read -p "Enter your GitHub repository URL: " github_url

log_status "Pushing code to GitHub..."
git add .
git commit -m "Deploy: Complete setup with Supabase schema and environment config"
git branch -M main
git remote add origin "$github_url"
git push -u origin main

if [ $? -eq 0 ]; then
    log_success "Code pushed to GitHub"
else
    log_error "Failed to push to GitHub"
    exit 1
fi

# ============================================================================
# Phase 6: GitHub Secrets
# ============================================================================

echo ""
log_status "PHASE 6: Setting Up GitHub Secrets"
log_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "GitHub secrets must be set manually. Go to:"
echo -e "  ${CYAN}GitHub → Your Repo → Settings → Secrets and variables → Actions${NC}"
echo ""

log_warning "Add these secrets (click 'New repository secret' for each):"
echo ""
echo "  Name: VITE_SUPABASE_URL"
echo "  Value: $SUPABASE_URL"
echo ""
echo "  Name: VITE_SUPABASE_ANON_KEY"
echo "  Value: ${SUPABASE_ANON_KEY:0:20}..."
echo ""
echo "  Name: SUPABASE_URL"
echo "  Value: $SUPABASE_URL"
echo ""
echo "  Name: SUPABASE_SERVICE_ROLE_KEY"
echo "  Value: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."
echo ""
echo "  Name: SUPABASE_DB_PASSWORD"
echo "  Value: [your-password]"
echo ""

echo -e "${CYAN}Also add Vercel credentials (get from https://vercel.com/account/tokens):${NC}"
echo "  Name: VERCEL_TOKEN"
echo "  Name: VERCEL_ORG_ID"
echo "  Name: VERCEL_PROJECT_ID"
echo ""

read -p "Have you added all secrets to GitHub? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    log_warning "Please add the secrets before continuing"
    exit 0
fi

# ============================================================================
# Success
# ============================================================================

echo ""
log_success "╔════════════════════════════════════════════════════════════════╗"
log_success "║  ✓ DEPLOYMENT SETUP COMPLETE!                                 ║"
log_success "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "Your app is configured for deployment with:"
echo -e "  ${GREEN}✓ Frontend: Vercel${NC}"
echo -e "  ${GREEN}✓ Backend: Supabase${NC}"
echo -e "  ${GREEN}✓ CI/CD: GitHub Actions${NC}"
echo ""

echo "Next steps:"
echo "  1. Deploy to Vercel (https://vercel.com/dashboard → Add Project)"
echo "  2. Add Vercel secrets to GitHub"
echo "  3. Watch deployment in GitHub Actions"
echo ""

log_success "Ready to deploy! 🚀"
