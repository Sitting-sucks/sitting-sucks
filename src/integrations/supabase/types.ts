export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      client_programs: {
        Row: {
          assigned_at: string | null
          client_id: string
          id: string
          program_id: string
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          client_id: string
          id?: string
          program_id: string
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          client_id?: string
          id?: string
          program_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_programs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          last_message_at: string | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_workouts: {
        Row: {
          created_at: string
          id: string
          user_id: string | null
          workout_data: Json
          workout_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id?: string | null
          workout_data: Json
          workout_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string | null
          workout_data?: Json
          workout_date?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          baseline: string | null
          categories: string[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          equipment: string[] | null
          id: string
          instructions: string | null
          intensity: string | null
          joint_movements: string[] | null
          macro_groups: string[] | null
          movement_patterns: string[] | null
          muscle_groups: string[] | null
          name: string
          progression: string | null
          regression: string | null
          tags: string[] | null
          tips: string[] | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          baseline?: string | null
          categories?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          equipment?: string[] | null
          id?: string
          instructions?: string | null
          intensity?: string | null
          joint_movements?: string[] | null
          macro_groups?: string[] | null
          movement_patterns?: string[] | null
          muscle_groups?: string[] | null
          name: string
          progression?: string | null
          regression?: string | null
          tags?: string[] | null
          tips?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          baseline?: string | null
          categories?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          equipment?: string[] | null
          id?: string
          instructions?: string | null
          intensity?: string | null
          joint_movements?: string[] | null
          macro_groups?: string[] | null
          movement_patterns?: string[] | null
          muscle_groups?: string[] | null
          name?: string
          progression?: string | null
          regression?: string | null
          tags?: string[] | null
          tips?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      login_history: {
        Row: {
          device_info: string | null
          id: string
          ip_address: unknown
          logged_in_at: string | null
          user_id: string
        }
        Insert: {
          device_info?: string | null
          id?: string
          ip_address?: unknown
          logged_in_at?: string | null
          user_id: string
        }
        Update: {
          device_info?: string | null
          id?: string
          ip_address?: unknown
          logged_in_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_records: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          max_reps: number | null
          max_reps_date: string | null
          max_total_volume: number | null
          max_total_volume_date: string | null
          max_volume: number | null
          max_volume_date: string | null
          max_weight: number | null
          max_weight_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          max_reps?: number | null
          max_reps_date?: string | null
          max_total_volume?: number | null
          max_total_volume_date?: string | null
          max_volume?: number | null
          max_volume_date?: string | null
          max_weight?: number | null
          max_weight_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          max_reps?: number | null
          max_reps_date?: string | null
          max_total_volume?: number | null
          max_total_volume_date?: string | null
          max_volume?: number | null
          max_volume_date?: string | null
          max_weight?: number | null
          max_weight_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      point_history: {
        Row: {
          created_at: string | null
          id: string
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          points: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      prescribed_exercises: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number | null
          prescribed_for: string
          reps: string | null
          sets: number | null
          trainer_id: string | null
          workout_log_id: string | null
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number | null
          prescribed_for?: string
          reps?: string | null
          sets?: number | null
          trainer_id?: string | null
          workout_log_id?: string | null
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number | null
          prescribed_for?: string
          reps?: string | null
          sets?: number | null
          trainer_id?: string | null
          workout_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescribed_exercises_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescribed_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescribed_exercises_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescribed_exercises_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          fitness_goals: string[] | null
          full_name: string | null
          id: string
          is_public: boolean
          onboarding_complete: boolean
          onboarding_data: Json | null
          program_personalization: Json | null
          role: string | null
          trainer_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          fitness_goals?: string[] | null
          full_name?: string | null
          id: string
          is_public?: boolean
          onboarding_complete?: boolean
          onboarding_data?: Json | null
          program_personalization?: Json | null
          role?: string | null
          trainer_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          fitness_goals?: string[] | null
          full_name?: string | null
          id?: string
          is_public?: boolean
          onboarding_complete?: boolean
          onboarding_data?: Json | null
          program_personalization?: Json | null
          role?: string | null
          trainer_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_exercises: {
        Row: {
          created_at: string | null
          day_number: number | null
          duration: string | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number | null
          program_id: string
          reps: string | null
          rest_seconds: number | null
          sets: number | null
          week_number: number | null
        }
        Insert: {
          created_at?: string | null
          day_number?: number | null
          duration?: string | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number | null
          program_id: string
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          week_number?: number | null
        }
        Update: {
          created_at?: string | null
          day_number?: number | null
          duration?: string | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number | null
          program_id?: string
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "program_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_exercises_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_weeks: number | null
          equipment_needed: string[] | null
          frequency: string | null
          goals: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_premade: boolean | null
          is_template: boolean | null
          name: string
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          equipment_needed?: string[] | null
          frequency?: string | null
          goals?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_premade?: boolean | null
          is_template?: boolean | null
          name: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          equipment_needed?: string[] | null
          frequency?: string | null
          goals?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_premade?: boolean | null
          is_template?: boolean | null
          name?: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          calendar_event_id: string | null
          client_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          session_date: string
          source: string | null
          title: string | null
          trainer_id: string | null
          with_trainer: boolean | null
        }
        Insert: {
          calendar_event_id?: string | null
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date?: string
          source?: string | null
          title?: string | null
          trainer_id?: string | null
          with_trainer?: boolean | null
        }
        Update: {
          calendar_event_id?: string | null
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date?: string
          source?: string | null
          title?: string | null
          trainer_id?: string | null
          with_trainer?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_description: string | null
          achievement_icon: string | null
          achievement_name: string
          achievement_type: string
          earned_at: string | null
          id: string
          points_awarded: number | null
          tier: string | null
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_icon?: string | null
          achievement_name: string
          achievement_type: string
          earned_at?: string | null
          id?: string
          points_awarded?: number | null
          tier?: string | null
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_icon?: string | null
          achievement_name?: string
          achievement_type?: string
          earned_at?: string | null
          id?: string
          points_awarded?: number | null
          tier?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_gamification: {
        Row: {
          achievements_unlocked: number | null
          best_week_workouts: number | null
          consecutive_weeks_active: number | null
          created_at: string | null
          current_level: number | null
          current_streak: number | null
          exercises_logged: number | null
          id: string
          last_sign_in_date: string | null
          last_workout_date: string | null
          longest_streak: number | null
          total_duration_minutes: number | null
          total_points: number | null
          total_weight_lifted: number | null
          updated_at: string | null
          user_id: string
          workouts_completed: number | null
        }
        Insert: {
          achievements_unlocked?: number | null
          best_week_workouts?: number | null
          consecutive_weeks_active?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          exercises_logged?: number | null
          id?: string
          last_sign_in_date?: string | null
          last_workout_date?: string | null
          longest_streak?: number | null
          total_duration_minutes?: number | null
          total_points?: number | null
          total_weight_lifted?: number | null
          updated_at?: string | null
          user_id: string
          workouts_completed?: number | null
        }
        Update: {
          achievements_unlocked?: number | null
          best_week_workouts?: number | null
          consecutive_weeks_active?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          exercises_logged?: number | null
          id?: string
          last_sign_in_date?: string | null
          last_workout_date?: string | null
          longest_streak?: number | null
          total_duration_minutes?: number | null
          total_points?: number | null
          total_weight_lifted?: number | null
          updated_at?: string | null
          user_id?: string
          workouts_completed?: number | null
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          difficulty_rating: number | null
          exercises_completed: number | null
          id: string
          notes: string | null
          total_duration: number | null
          user_id: string
          workout_date: string
        }
        Insert: {
          created_at?: string
          difficulty_rating?: number | null
          exercises_completed?: number | null
          id?: string
          notes?: string | null
          total_duration?: number | null
          user_id: string
          workout_date: string
        }
        Update: {
          created_at?: string
          difficulty_rating?: number | null
          exercises_completed?: number | null
          id?: string
          notes?: string | null
          total_duration?: number | null
          user_id?: string
          workout_date?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          avg_reps_per_set: number | null
          avg_sets_per_workout: number | null
          avg_workout_duration_minutes: number | null
          created_at: string | null
          exercise_counts: Json | null
          favorite_workout_time: string | null
          id: string
          month_start_date: string | null
          monthly_duration_minutes: number | null
          monthly_reps: number | null
          monthly_sets: number | null
          monthly_weight: number | null
          monthly_workouts: number | null
          most_active_day: string | null
          muscle_group_counts: Json | null
          total_duration_minutes: number | null
          total_reps: number | null
          total_sets: number | null
          total_weight_lifted: number | null
          total_workouts: number | null
          updated_at: string | null
          user_id: string
          week_start_date: string | null
          weekly_duration_minutes: number | null
          weekly_reps: number | null
          weekly_sets: number | null
          weekly_weight: number | null
          weekly_workouts: number | null
        }
        Insert: {
          avg_reps_per_set?: number | null
          avg_sets_per_workout?: number | null
          avg_workout_duration_minutes?: number | null
          created_at?: string | null
          exercise_counts?: Json | null
          favorite_workout_time?: string | null
          id?: string
          month_start_date?: string | null
          monthly_duration_minutes?: number | null
          monthly_reps?: number | null
          monthly_sets?: number | null
          monthly_weight?: number | null
          monthly_workouts?: number | null
          most_active_day?: string | null
          muscle_group_counts?: Json | null
          total_duration_minutes?: number | null
          total_reps?: number | null
          total_sets?: number | null
          total_weight_lifted?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          user_id: string
          week_start_date?: string | null
          weekly_duration_minutes?: number | null
          weekly_reps?: number | null
          weekly_sets?: number | null
          weekly_weight?: number | null
          weekly_workouts?: number | null
        }
        Update: {
          avg_reps_per_set?: number | null
          avg_sets_per_workout?: number | null
          avg_workout_duration_minutes?: number | null
          created_at?: string | null
          exercise_counts?: Json | null
          favorite_workout_time?: string | null
          id?: string
          month_start_date?: string | null
          monthly_duration_minutes?: number | null
          monthly_reps?: number | null
          monthly_sets?: number | null
          monthly_weight?: number | null
          monthly_workouts?: number | null
          most_active_day?: string | null
          muscle_group_counts?: Json | null
          total_duration_minutes?: number | null
          total_reps?: number | null
          total_sets?: number | null
          total_weight_lifted?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          user_id?: string
          week_start_date?: string | null
          weekly_duration_minutes?: number | null
          weekly_reps?: number | null
          weekly_sets?: number | null
          weekly_weight?: number | null
          weekly_workouts?: number | null
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          calories_burned: number | null
          duration_minutes: number | null
          exercise_id: string | null
          external_id: string | null
          heart_rate_avg: number | null
          heart_rate_max: number | null
          id: string
          logged_at: string | null
          muscle_groups_worked: string[] | null
          notes: string | null
          perceived_effort: number | null
          program_id: string | null
          rating: number | null
          reps_completed: string | null
          session_id: string | null
          sets_completed: number | null
          source: string | null
          user_id: string
          weight_used: string | null
          workout_name: string | null
        }
        Insert: {
          calories_burned?: number | null
          duration_minutes?: number | null
          exercise_id?: string | null
          external_id?: string | null
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          id?: string
          logged_at?: string | null
          muscle_groups_worked?: string[] | null
          notes?: string | null
          perceived_effort?: number | null
          program_id?: string | null
          rating?: number | null
          reps_completed?: string | null
          session_id?: string | null
          sets_completed?: number | null
          source?: string | null
          user_id: string
          weight_used?: string | null
          workout_name?: string | null
        }
        Update: {
          calories_burned?: number | null
          duration_minutes?: number | null
          exercise_id?: string | null
          external_id?: string | null
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          id?: string
          logged_at?: string | null
          muscle_groups_worked?: string[] | null
          notes?: string | null
          perceived_effort?: number | null
          program_id?: string | null
          rating?: number | null
          reps_completed?: string | null
          session_id?: string | null
          sets_completed?: number | null
          source?: string | null
          user_id?: string
          weight_used?: string | null
          workout_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_recommendations: {
        Row: {
          created_at: string | null
          days_since_last_workout: number | null
          expires_at: string | null
          id: string
          last_workout_id: string | null
          muscle_groups_needing_work: string[] | null
          recommendation_reason: string | null
          recommended_exercise_ids: string[] | null
          recommended_program_id: string | null
          responded_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_since_last_workout?: number | null
          expires_at?: string | null
          id?: string
          last_workout_id?: string | null
          muscle_groups_needing_work?: string[] | null
          recommendation_reason?: string | null
          recommended_exercise_ids?: string[] | null
          recommended_program_id?: string | null
          responded_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_since_last_workout?: number | null
          expires_at?: string | null
          id?: string
          last_workout_id?: string | null
          muscle_groups_needing_work?: string[] | null
          recommendation_reason?: string | null
          recommended_exercise_ids?: string[] | null
          recommended_program_id?: string | null
          responded_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_recommendations_recommended_program_id_fkey"
            columns: ["recommended_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_client: { Args: { p_client_id: string }; Returns: undefined }
      release_client: { Args: { p_client_id: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
