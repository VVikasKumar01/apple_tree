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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_marks: {
        Row: {
          academic_year: string
          created_at: string
          id: string
          max_marks: number | null
          school: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          subject_id: string
          term1_marks: number | null
          term2_marks: number | null
          term3_marks: number | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          id?: string
          max_marks?: number | null
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          subject_id: string
          term1_marks?: number | null
          term2_marks?: number | null
          term3_marks?: number | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          id?: string
          max_marks?: number | null
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id?: string
          subject_id?: string
          term1_marks?: number | null
          term2_marks?: number | null
          term3_marks?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      attendance_summary: {
        Row: {
          academic_year: string
          created_at: string
          days_present: number | null
          id: string
          school: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          total_working_days: number | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          days_present?: number | null
          id?: string
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          total_working_days?: number | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          days_present?: number | null
          id?: string
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id?: string
          total_working_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_summary_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          school: Database["public"]["Enums"]["school_code"] | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          school?: Database["public"]["Enums"]["school_code"] | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          school?: Database["public"]["Enums"]["school_code"] | null
          title?: string
        }
        Relationships: []
      }
      other_fees: {
        Row: {
          academic_year: string
          books_allotted: string | null
          books_status: string | null
          created_at: string
          id: string
          notes: string | null
          school: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          uniform_size: string | null
          uniform_status: string | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          books_allotted?: string | null
          books_status?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          uniform_size?: string | null
          uniform_status?: string | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          books_allotted?: string | null
          books_status?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id?: string
          uniform_size?: string | null
          uniform_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "other_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          academic_year: string | null
          admission_number: string
          blood_group: string | null
          caste: string | null
          class_grade: string | null
          correspondence_address: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          father_aadhaar: string | null
          father_mobile: string | null
          father_name: string | null
          father_occupation: string | null
          gender: string | null
          height_cm: number | null
          id: string
          mother_aadhaar: string | null
          mother_mobile: string | null
          mother_name: string | null
          mother_occupation: string | null
          nationality: string | null
          permanent_address: string | null
          photo_url: string | null
          primary_mobile: string | null
          religion: string | null
          school: Database["public"]["Enums"]["school_code"] | null
          section: string | null
          student_aadhaar: string | null
          student_name: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          academic_year?: string | null
          admission_number: string
          blood_group?: string | null
          caste?: string | null
          class_grade?: string | null
          correspondence_address?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          father_aadhaar?: string | null
          father_mobile?: string | null
          father_name?: string | null
          father_occupation?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          mother_aadhaar?: string | null
          mother_mobile?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          nationality?: string | null
          permanent_address?: string | null
          photo_url?: string | null
          primary_mobile?: string | null
          religion?: string | null
          school?: Database["public"]["Enums"]["school_code"] | null
          section?: string | null
          student_aadhaar?: string | null
          student_name: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          academic_year?: string | null
          admission_number?: string
          blood_group?: string | null
          caste?: string | null
          class_grade?: string | null
          correspondence_address?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          father_aadhaar?: string | null
          father_mobile?: string | null
          father_name?: string | null
          father_occupation?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          mother_aadhaar?: string | null
          mother_mobile?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          nationality?: string | null
          permanent_address?: string | null
          photo_url?: string | null
          primary_mobile?: string | null
          religion?: string | null
          school?: Database["public"]["Enums"]["school_code"] | null
          section?: string | null
          student_aadhaar?: string | null
          student_name?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      tuition_fees: {
        Row: {
          academic_year: string
          created_at: string
          finalized_fee: number | null
          id: string
          school: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          term1_fee: number | null
          term1_payment_date: string | null
          term1_payment_mode: string | null
          term1_status: string | null
          term1_txn_id: string | null
          term2_fee: number | null
          term2_payment_date: string | null
          term2_payment_mode: string | null
          term2_status: string | null
          term2_txn_id: string | null
          term3_fee: number | null
          term3_payment_date: string | null
          term3_payment_mode: string | null
          term3_status: string | null
          term3_txn_id: string | null
          total_annual_fee: number | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          finalized_fee?: number | null
          id?: string
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id: string
          term1_fee?: number | null
          term1_payment_date?: string | null
          term1_payment_mode?: string | null
          term1_status?: string | null
          term1_txn_id?: string | null
          term2_fee?: number | null
          term2_payment_date?: string | null
          term2_payment_mode?: string | null
          term2_status?: string | null
          term2_txn_id?: string | null
          term3_fee?: number | null
          term3_payment_date?: string | null
          term3_payment_mode?: string | null
          term3_status?: string | null
          term3_txn_id?: string | null
          total_annual_fee?: number | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          finalized_fee?: number | null
          id?: string
          school?: Database["public"]["Enums"]["school_code"] | null
          student_id?: string
          term1_fee?: number | null
          term1_payment_date?: string | null
          term1_payment_mode?: string | null
          term1_status?: string | null
          term1_txn_id?: string | null
          term2_fee?: number | null
          term2_payment_date?: string | null
          term2_payment_mode?: string | null
          term2_status?: string | null
          term2_txn_id?: string | null
          term3_fee?: number | null
          term3_payment_date?: string | null
          term3_payment_mode?: string | null
          term3_status?: string | null
          term3_txn_id?: string | null
          total_annual_fee?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tuition_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          school: Database["public"]["Enums"]["school_code"] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          school?: Database["public"]["Enums"]["school_code"] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          school?: Database["public"]["Enums"]["school_code"] | null
          user_id?: string
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
      app_role: "admin"
      school_code: "apple_tree" | "apple_play"
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
    Enums: {
      app_role: ["admin"],
      school_code: ["apple_tree", "apple_play"],
    },
  },
} as const
