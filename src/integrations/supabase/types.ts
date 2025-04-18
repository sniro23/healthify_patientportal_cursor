export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          consultation_type: string
          created_at: string
          scheduled_date: string
          delivery_method: string
          id: string
          notes: string | null
          provider_type: string
          specialty: string | null
          status: string
          scheduled_time: string
          updated_at: string
          patient_id: string
        }
        Insert: {
          consultation_type: string
          created_at?: string
          scheduled_date: string
          delivery_method: string
          id?: string
          notes?: string | null
          provider_type: string
          specialty?: string | null
          status?: string
          scheduled_time: string
          updated_at?: string
          patient_id: string
        }
        Update: {
          consultation_type?: string
          created_at?: string
          scheduled_date?: string
          delivery_method?: string
          id?: string
          notes?: string | null
          provider_type?: string
          specialty?: string | null
          status?: string
          scheduled_time?: string
          updated_at?: string
          patient_id?: string
        }
        Relationships: []
      }
      health_lab_reports: {
        Row: {
          created_at: string
          date: string
          fileurl: string | null
          id: string
          name: string
          status: string
          testresults: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          fileurl?: string | null
          id?: string
          name: string
          status: string
          testresults?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          fileurl?: string | null
          id?: string
          name?: string
          status?: string
          testresults?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_lifestyle: {
        Row: {
          activity_level: string
          alcohol_consumption: string
          created_at: string
          id: string
          smoking_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level: string
          alcohol_consumption: string
          created_at?: string
          id?: string
          smoking_status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: string
          alcohol_consumption?: string
          created_at?: string
          id?: string
          smoking_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          created_at: string
          id: string
          metrics: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_personal_info: {
        Row: {
          address: string
          age: number
          children: number
          created_at: string
          full_name: string
          gender: string
          id: string
          marital_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          age: number
          children?: number
          created_at?: string
          full_name: string
          gender: string
          id?: string
          marital_status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          age?: number
          children?: number
          created_at?: string
          full_name?: string
          gender?: string
          id?: string
          marital_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_vitals: {
        Row: {
          blood_group: string
          bmi: number
          created_at: string
          height: number
          id: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          blood_group: string
          bmi: number
          created_at?: string
          height: number
          id?: string
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          blood_group?: string
          bmi?: number
          created_at?: string
          height?: number
          id?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          name: string
          notes: string | null
          prescribed_by: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          name: string
          notes?: string | null
          prescribed_by?: string | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          name?: string
          notes?: string | null
          prescribed_by?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          has_completed_profile: boolean
          height: number | null
          id: string
          last_name: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          has_completed_profile?: boolean
          height?: number | null
          id: string
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          has_completed_profile?: boolean
          height?: number | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          has_completed_profile: boolean
          height: number | null
          id: string
          last_name: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string
          weight: number | null
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
