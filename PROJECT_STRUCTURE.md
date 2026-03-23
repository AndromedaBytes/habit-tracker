# Project Structure and Overview

This document outlines the complete file structure and purpose of each component in the Sanctuary application.

## 1. Core Configuration files

-   `src/main.tsx`: Application entry point. Renders the root component and handles global styles.
-   `src/App.tsx`: Main application shell. Manages routes (Dashboard vs Analytics), modals, and toasts.
-   `src/types/index.ts`: TypeScript interfaces for `Habit`, `Log`, `Tick`, ensuring type safety across the app.
-   `src/constants.ts`: Global constants, including default habits and configuration values.
-   `tailwind.config.mjs`: Utility classes configuration, custom fonts, and animation settings.
-   `vite.config.ts`: Vite build configuration.
-   `tsconfig.json`: TypeScript compiler options for strict type checking.

## 2. State Management & Data Fetching

-   `src/store/habitStore.ts`: Central store using Zustand. Implements optimistic UI updates for instant feedback.
-   `src/lib/supabase.ts`: Supabase client initialization.
-   `src/lib/api.ts`: API functions for CRUD operations on Habits, Logs, and Tasks.
-   `src/hooks/useRealtimeSync.ts`: Custom hook to subscribe to Supabase Realtime changes.
-   `src/hooks/useAuth.ts`: Authentication hook managing login sessions and user profiles.

## 3. UI Components

### Dashboard

-   `src/components/dashboard/HabitList.tsx`: Displays the list of habits with completion toggles.
-   `src/components/dashboard/DailyLog.tsx`: Component for logging mood, energy, and journal entries.
-   `src/components/dashboard/StatCards.tsx`: Overview cards showing streaks and today's progress.

### Habits

-   `src/components/habits/HabitItem.tsx`: Individual habit row with animations.
-   `src/components/habits/AddHabitModal.tsx`: Form for creating new habits.

### Analytics

-   `src/components/analytics/AnalyticsView.tsx`: Comprehensive analytics dashboard.
-   `src/components/analytics/Heatmap.tsx`: GitHub-style contribution graph for habit completions.
-   `src/components/analytics/Charts.tsx`: Visualization components for trends and progress.

### Shared / UI

-   `src/components/layout/Header.tsx`: Navigation bar with view switcher (Dashboard/Analytics).
-   `src/components/shared/FadeUp.tsx`: Framer Motion wrapper for fade-in animations.
-   `src/components/ui/Modal.tsx`: Reusable modal dialog component.
-   `src/components/ui/Toast.tsx`: Notification system.

## 4. Deployment & CI/CD

-   `.github/workflows/deploy.yml`: GitHub Actions workflow for automated deployments to Vercel.
-   `vercel.json`: Vercel configuration for routing and build settings.

## 5. Next Steps

1.  **Run Locally**: `npm run dev`
2.  **Verify Build**: `npm run build` (Ensures no errors exist)
3.  **View Deployment**: Check your Vercel dashboard for the latest deployment status.
