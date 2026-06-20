export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      booking_rate_limits: {
        Row: {
          attempts: number;
          created_at: string | null;
          id: string;
          identifier: string;
          scope: string;
          window_start: string;
        };
        Insert: {
          attempts?: number;
          created_at?: string | null;
          id?: string;
          identifier: string;
          scope: string;
          window_start: string;
        };
        Update: {
          attempts?: number;
          created_at?: string | null;
          id?: string;
          identifier?: string;
          scope?: string;
          window_start?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          booking_code: string;
          created_at: string | null;
          id: string;
          notes: string | null;
          package_id: string | null;
          status: Database["public"]["Enums"]["booking_status_enum"] | null;
          student_id: string | null;
          total_price: number;
          updated_at: string | null;
        };
        Insert: {
          booking_code: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          package_id?: string | null;
          status?: Database["public"]["Enums"]["booking_status_enum"] | null;
          student_id?: string | null;
          total_price: number;
          updated_at?: string | null;
        };
        Update: {
          booking_code?: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          package_id?: string | null;
          status?: Database["public"]["Enums"]["booking_status_enum"] | null;
          student_id?: string | null;
          total_price?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      packages: {
        Row: {
          car_type: Database["public"]["Enums"]["car_type_enum"];
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          price: number;
          total_sessions: number;
          updated_at: string | null;
        };
        Insert: {
          car_type?: Database["public"]["Enums"]["car_type_enum"];
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          price: number;
          total_sessions: number;
          updated_at?: string | null;
        };
        Update: {
          car_type?: Database["public"]["Enums"]["car_type_enum"];
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          price?: number;
          total_sessions?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          booking_id: string | null;
          created_at: string | null;
          id: string;
          method: string | null;
          proof_path: string;
          rejected_reason: string | null;
          status: Database["public"]["Enums"]["payment_status_enum"] | null;
          updated_at: string | null;
          verified_at: string | null;
        };
        Insert: {
          amount: number;
          booking_id?: string | null;
          created_at?: string | null;
          id?: string;
          method?: string | null;
          proof_path: string;
          rejected_reason?: string | null;
          status?: Database["public"]["Enums"]["payment_status_enum"] | null;
          updated_at?: string | null;
          verified_at?: string | null;
        };
        Update: {
          amount?: number;
          booking_id?: string | null;
          created_at?: string | null;
          id?: string;
          method?: string | null;
          proof_path?: string;
          rejected_reason?: string | null;
          status?: Database["public"]["Enums"]["payment_status_enum"] | null;
          updated_at?: string | null;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions: {
        Row: {
          booking_id: string | null;
          created_at: string | null;
          duration_minutes: number;
          id: string;
          notes: string | null;
          session_date: string;
          session_number: number;
          start_time: string;
          status: Database["public"]["Enums"]["session_status_enum"] | null;
          updated_at: string | null;
        };
        Insert: {
          booking_id?: string | null;
          created_at?: string | null;
          duration_minutes?: number;
          id?: string;
          notes?: string | null;
          session_date: string;
          session_number: number;
          start_time: string;
          status?: Database["public"]["Enums"]["session_status_enum"] | null;
          updated_at?: string | null;
        };
        Update: {
          booking_id?: string | null;
          created_at?: string | null;
          duration_minutes?: number;
          id?: string;
          notes?: string | null;
          session_date?: string;
          session_number?: number;
          start_time?: string;
          status?: Database["public"]["Enums"]["session_status_enum"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          phone_number: string;
          pickup_address: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          phone_number: string;
          pickup_address?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          phone_number?: string;
          pickup_address?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      booking_status_enum:
        | "pending_verification"
        | "confirmed"
        | "canceled"
        | "completed";
      car_type_enum: "mobil_kursus" | "mobil_sendiri";
      payment_status_enum: "pending_verification" | "verified" | "rejected";
      session_status_enum: "tentative" | "scheduled" | "completed" | "canceled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;
