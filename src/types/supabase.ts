// Generated-compatible schema typing for Supabase client.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string | null; created_at: string | null };
        Insert: { id: string; email?: string | null; created_at?: string | null };
        Update: { id?: string; email?: string | null; created_at?: string | null };
        Relationships: [{ foreignKeyName: "profiles_id_fkey"; columns: ["id"]; isOneToOne: true; referencedRelation: "users"; referencedColumns: ["id"] }];
      };
      habits: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          category: "black" | "blue" | "red";
          non_neg: boolean | null;
          created_at: string | null;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          category: "black" | "blue" | "red";
          non_neg?: boolean | null;
          created_at?: string | null;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          category?: "black" | "blue" | "red";
          non_neg?: boolean | null;
          created_at?: string | null;
          sort_order?: number | null;
        };
        Relationships: [{ foreignKeyName: "habits_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      habit_ticks: {
        Row: { id: string; user_id: string | null; habit_id: string | null; tick_date: string };
        Insert: { id?: string; user_id?: string | null; habit_id?: string | null; tick_date: string };
        Update: { id?: string; user_id?: string | null; habit_id?: string | null; tick_date?: string };
        Relationships: [
          { foreignKeyName: "habit_ticks_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "habit_ticks_habit_id_fkey"; columns: ["habit_id"]; isOneToOne: false; referencedRelation: "habits"; referencedColumns: ["id"] }
        ];
      };
      daily_logs: {
        Row: {
          id: string;
          user_id: string | null;
          log_date: string;
          mood: number | null;
          energy: number | null;
          sleep_hours: number | null;
          memorable_moment: string | null;
          intention: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          log_date: string;
          mood?: number | null;
          energy?: number | null;
          sleep_hours?: number | null;
          memorable_moment?: string | null;
          intention?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          log_date?: string;
          mood?: number | null;
          energy?: number | null;
          sleep_hours?: number | null;
          memorable_moment?: string | null;
          intention?: string | null;
        };
        Relationships: [{ foreignKeyName: "daily_logs_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string | null;
          entry_date: string;
          body: string | null;
          gratitude_1: string | null;
          gratitude_2: string | null;
          gratitude_3: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          entry_date: string;
          body?: string | null;
          gratitude_1?: string | null;
          gratitude_2?: string | null;
          gratitude_3?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          entry_date?: string;
          body?: string | null;
          gratitude_1?: string | null;
          gratitude_2?: string | null;
          gratitude_3?: string | null;
          created_at?: string | null;
        };
        Relationships: [{ foreignKeyName: "journal_entries_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      weekly_reviews: {
        Row: {
          id: string;
          user_id: string | null;
          review_date: string;
          went_well: string | null;
          drained: string | null;
          drop_habit: string | null;
          double_down: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          review_date: string;
          went_well?: string | null;
          drained?: string | null;
          drop_habit?: string | null;
          double_down?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          review_date?: string;
          went_well?: string | null;
          drained?: string | null;
          drop_habit?: string | null;
          double_down?: string | null;
          created_at?: string | null;
        };
        Relationships: [{ foreignKeyName: "weekly_reviews_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      trigger_log: {
        Row: {
          id: string;
          user_id: string | null;
          habit_name: string | null;
          trigger_text: string | null;
          log_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          habit_name?: string | null;
          trigger_text?: string | null;
          log_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          habit_name?: string | null;
          trigger_text?: string | null;
          log_date?: string | null;
          created_at?: string | null;
        };
        Relationships: [{ foreignKeyName: "trigger_log_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      wind_down: {
        Row: { id: string; user_id: string | null; log_date: string; item_index: number; completed: boolean | null };
        Insert: {
          id?: string;
          user_id?: string | null;
          log_date: string;
          item_index: number;
          completed?: boolean | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          log_date?: string;
          item_index?: number;
          completed?: boolean | null;
        };
        Relationships: [{ foreignKeyName: "wind_down_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      milestones: {
        Row: { id: string; user_id: string | null; milestone_id: string; unlocked_at: string | null };
        Insert: { id?: string; user_id?: string | null; milestone_id: string; unlocked_at?: string | null };
        Update: { id?: string; user_id?: string | null; milestone_id?: string; unlocked_at?: string | null };
        Relationships: [{ foreignKeyName: "milestones_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      app_settings: {
        Row: { user_id: string; signal_habit_id: string | null; timer_sessions: number | null };
        Insert: { user_id: string; signal_habit_id?: string | null; timer_sessions?: number | null };
        Update: { user_id?: string; signal_habit_id?: string | null; timer_sessions?: number | null };
        Relationships: [
          { foreignKeyName: "app_settings_user_id_fkey"; columns: ["user_id"]; isOneToOne: true; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "app_settings_signal_habit_id_fkey"; columns: ["signal_habit_id"]; isOneToOne: true; referencedRelation: "habits"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
