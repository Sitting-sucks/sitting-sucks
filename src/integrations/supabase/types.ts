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
  public: {
    Tables: {
      client_programs: {
        Row: {
          id: string
          client_id: string
          program_id: string
          assigned_at: string
          status: string
        }
        Insert: {
          id?: string
          client_id: string
          program_id: string
          assigned_at?: string
          status?: string
        }
        Update: {
          id?: string
          client_id?: string
          program_id?: string
          assigned_at?: string
          status?: string
        }
        Relationships: []
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
          id: string
          name: string
          description: string | null
          instructions: string | null
          equipment: string[]
          joint_movements: string[]
          muscle_groups: string[]
          macro_groups: string[]
          movement_patterns: string[]
          difficulty: string
          intensity: string
          duration: string | null
          video_url: string | null
          baseline: string | null
          progression: string | null
          regression: string | null
          categories: string[]
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          instructions?: string | null
          equipment?: string[]
          joint_movements?: string[]
          muscle_groups?: string[]
          macro_groups?: string[]
          movement_patterns?: string[]
          difficulty?: string
          intensity?: string
          duration?: string | null
          video_url?: string | null
          baseline?: string | null
          progression?: string | null
          regression?: string | null
          categories?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          instructions?: string | null
          equipment?: string[]
          joint_movements?: string[]
          muscle_groups?: string[]
          macro_groups?: string[]
          movement_patterns?: string[]
          difficulty?: string
          intensity?: string
          duration?: string | null
          video_url?: string | null
          baseline?: string | null
          progression?: string | null
          regression?: string | null
          categories?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          updated_at: string
          username: string | null
          role: string
          trainer_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          fitness_goals?: string[] | null
          full_name?: string | null
          id: string
          is_public?: boolean
          updated_at?: string
          username?: string | null
          role?: string
          trainer_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          fitness_goals?: string[] | null
          full_name?: string | null
          id?: string
          is_public?: boolean
          updated_at?: string
          username?: string | null
          role?: string
          trainer_id?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          id: string
          name: string
          description: string | null
          is_template: boolean
          is_premade: boolean
          trainer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_template?: boolean
          is_premade?: boolean
          trainer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_template?: boolean
          is_premade?: boolean
          trainer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_exercises: {
        Row: {
          id: string
          program_id: string
          exercise_id: string
          day_number: number
          order_index: number
          sets: number | null
          reps: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          program_id: string
          exercise_id: string
          day_number?: number
          order_index?: number
          sets?: number | null
          reps?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          exercise_id?: string
          day_number?: number
          order_index?: number
          sets?: number | null
          reps?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
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
      workout_logs: {
        Row: {
          id: string
          user_id: string
          program_id: string | null
          exercise_id: string | null
          logged_at: string
          sets_completed: number | null
          reps_completed: string | null
          weight_used: string | null
          notes: string | null
          workout_name: string | null
          duration_minutes: number | null
          calories_burned: number | null
          heart_rate_avg: number | null
          heart_rate_max: number | null
          rating: number | null
          perceived_effort: number | null
          source: string
          external_id: string | null
          muscle_groups_worked: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          program_id?: string | null
          exercise_id?: string | null
          logged_at?: string
          sets_completed?: number | null
          reps_completed?: string | null
          weight_used?: string | null
          notes?: string | null
          workout_name?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          rating?: number | null
          perceived_effort?: number | null
          source?: string
          external_id?: string | null
          muscle_groups_worked?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string | null
          exercise_id?: string | null
          logged_at?: string
          sets_completed?: number | null
          reps_completed?: string | null
          weight_used?: string | null
          notes?: string | null
          workout_name?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          rating?: number | null
          perceived_effort?: number | null
          source?: string
          external_id?: string | null
          muscle_groups_worked?: string[] | null
        }
        Relationships: []
      }
      user_gamification: {
        Row: {
          id: string
          user_id: string
          total_points: number
          current_level: number
          current_streak: number
          longest_streak: number
          last_sign_in_date: string | null
          workouts_completed: number
          exercises_logged: number
          achievements_unlocked: number
          total_weight_lifted: number
          total_duration_minutes: number
          last_workout_date: string | null
          consecutive_weeks_active: number
          best_week_workouts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_sign_in_date?: string | null
          workouts_completed?: number
          exercises_logged?: number
          achievements_unlocked?: number
          total_weight_lifted?: number
          total_duration_minutes?: number
          last_workout_date?: string | null
          consecutive_weeks_active?: number
          best_week_workouts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_sign_in_date?: string | null
          workouts_completed?: number
          exercises_logged?: number
          achievements_unlocked?: number
          total_weight_lifted?: number
          total_duration_minutes?: number
          last_workout_date?: string | null
          consecutive_weeks_active?: number
          best_week_workouts?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      point_history: {
        Row: {
          id: string
          user_id: string
          points: number
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points: number
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          reason?: string
          created_at?: string
        }
        Relationships: []
      }
      login_history: {
        Row: {
          id: string
          user_id: string
          logged_in_at: string
          device_info: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          user_id: string
          logged_in_at?: string
          device_info?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          logged_in_at?: string
          device_info?: string | null
          ip_address?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          total_workouts: number
          total_sets: number
          total_reps: number
          total_weight_lifted: number
          total_duration_minutes: number
          weekly_workouts: number
          weekly_sets: number
          weekly_reps: number
          weekly_weight: number
          weekly_duration_minutes: number
          week_start_date: string | null
          monthly_workouts: number
          monthly_sets: number
          monthly_reps: number
          monthly_weight: number
          monthly_duration_minutes: number
          month_start_date: string | null
          avg_workout_duration_minutes: number
          avg_sets_per_workout: number
          avg_reps_per_set: number
          muscle_group_counts: Record<string, number>
          exercise_counts: Record<string, number>
          favorite_workout_time: string | null
          most_active_day: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_workouts?: number
          total_sets?: number
          total_reps?: number
          total_weight_lifted?: number
          total_duration_minutes?: number
          weekly_workouts?: number
          weekly_sets?: number
          weekly_reps?: number
          weekly_weight?: number
          weekly_duration_minutes?: number
          week_start_date?: string | null
          monthly_workouts?: number
          monthly_sets?: number
          monthly_reps?: number
          monthly_weight?: number
          monthly_duration_minutes?: number
          month_start_date?: string | null
          avg_workout_duration_minutes?: number
          avg_sets_per_workout?: number
          avg_reps_per_set?: number
          muscle_group_counts?: Record<string, number>
          exercise_counts?: Record<string, number>
          favorite_workout_time?: string | null
          most_active_day?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_workouts?: number
          total_sets?: number
          total_reps?: number
          total_weight_lifted?: number
          total_duration_minutes?: number
          weekly_workouts?: number
          weekly_sets?: number
          weekly_reps?: number
          weekly_weight?: number
          weekly_duration_minutes?: number
          week_start_date?: string | null
          monthly_workouts?: number
          monthly_sets?: number
          monthly_reps?: number
          monthly_weight?: number
          monthly_duration_minutes?: number
          month_start_date?: string | null
          avg_workout_duration_minutes?: number
          avg_sets_per_workout?: number
          avg_reps_per_set?: number
          muscle_group_counts?: Record<string, number>
          exercise_counts?: Record<string, number>
          favorite_workout_time?: string | null
          most_active_day?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          max_weight: number | null
          max_reps: number | null
          max_volume: number | null
          max_total_volume: number | null
          max_weight_date: string | null
          max_reps_date: string | null
          max_volume_date: string | null
          max_total_volume_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          max_weight?: number | null
          max_reps?: number | null
          max_volume?: number | null
          max_total_volume?: number | null
          max_weight_date?: string | null
          max_reps_date?: string | null
          max_volume_date?: string | null
          max_total_volume_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          max_weight?: number | null
          max_reps?: number | null
          max_volume?: number | null
          max_total_volume?: number | null
          max_weight_date?: string | null
          max_reps_date?: string | null
          max_volume_date?: string | null
          max_total_volume_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          achievement_name: string
          achievement_description: string | null
          achievement_icon: string | null
          tier: string
          points_awarded: number
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          achievement_name: string
          achievement_description?: string | null
          achievement_icon?: string | null
          tier?: string
          points_awarded?: number
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          achievement_name?: string
          achievement_description?: string | null
          achievement_icon?: string | null
          tier?: string
          points_awarded?: number
          earned_at?: string
        }
        Relationships: []
      }
      workout_recommendations: {
        Row: {
          id: string
          user_id: string
          recommended_program_id: string | null
          recommended_exercise_ids: string[]
          recommendation_reason: string | null
          last_workout_id: string | null
          days_since_last_workout: number | null
          muscle_groups_needing_work: string[] | null
          status: string
          created_at: string
          expires_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          recommended_program_id?: string | null
          recommended_exercise_ids?: string[]
          recommendation_reason?: string | null
          last_workout_id?: string | null
          days_since_last_workout?: number | null
          muscle_groups_needing_work?: string[] | null
          status?: string
          created_at?: string
          expires_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          recommended_program_id?: string | null
          recommended_exercise_ids?: string[]
          recommendation_reason?: string | null
          last_workout_id?: string | null
          days_since_last_workout?: number | null
          muscle_groups_needing_work?: string[] | null
          status?: string
          created_at?: string
          expires_at?: string
          responded_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          trainer_id: string
          client_id: string
          created_at: string
          updated_at: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id: string
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          is_read?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
