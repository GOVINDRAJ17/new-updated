export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          location_consent: boolean | null
          location_lat: number | null
          location_lng: number | null
          phone: string | null
          updated_at: string | null
          upi_qr_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          location_consent?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          updated_at?: string | null
          upi_qr_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location_consent?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          updated_at?: string | null
          upi_qr_url?: string | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          id: string
          created_by: string
          title: string
          origin: string
          destination: string
          departure_time: string
          total_seats: number
          seats_left: number
          price_per_seat: number
          ride_code: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          title: string
          origin: string
          destination: string
          departure_time: string
          total_seats: number
          seats_left: number
          price_per_seat: number
          ride_code?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          title?: string
          origin?: string
          destination?: string
          departure_time?: string
          total_seats?: number
          seats_left?: number
          price_per_seat?: number
          ride_code?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ride_participants: {
        Row: {
          id: string
          ride_id: string
          user_id: string
          join_code: string | null
          amount_due: number | null
          amount_paid: number
          paid: boolean
          stripe_session_id: string | null
          payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          user_id: string
          join_code?: string | null
          amount_due?: number | null
          amount_paid?: number
          paid?: boolean
          stripe_session_id?: string | null
          payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          user_id?: string
          join_code?: string | null
          amount_due?: number | null
          amount_paid?: number
          paid?: boolean
          stripe_session_id?: string | null
          payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ride_chats: {
        Row: {
          id: string
          ride_id: string
          user_id: string
          type: string
          content: string | null
          audio_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          user_id: string
          type: string
          content?: string | null
          audio_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          user_id?: string
          type?: string
          content?: string | null
          audio_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string | null
          ride_id: string | null
          meta: Json | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body?: string | null
          ride_id?: string | null
          meta?: Json | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          body?: string | null
          ride_id?: string | null
          meta?: Json | null
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      history: {
        Row: {
          id: string
          user_id: string
          ride_id: string | null
          action: string
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ride_id?: string | null
          action: string
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ride_id?: string | null
          action?: string
          meta?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          user_id: string
          ride_id: string
          amount: number
          currency: string
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          status: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ride_id: string
          amount: number
          currency?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ride_id?: string
          amount?: number
          currency?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ride_codes: {
        Row: {
          id: string
          ride_id: string
          code: string
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          code: string
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          code?: string
          created_at?: string
        }
        Relationships: []
      }
      ride_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message_text: string
          ride_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_text: string
          ride_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_text?: string
          ride_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      ride_participants_legacy: {
        Row: {
          id: string
          joined_at: string | null
          ride_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          ride_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          ride_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string | null
          from_location: string
          id: string
          notes: string | null
          scheduled_date: string
          status: string | null
          to_location: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          from_location: string
          id?: string
          notes?: string | null
          scheduled_date: string
          status?: string | null
          to_location: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          from_location?: string
          id?: string
          notes?: string | null
          scheduled_date?: string
          status?: string | null
          to_location?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      split_payments: {
        Row: {
          created_at: string | null
          creator_id: string
          email_sent: boolean | null
          id: string
          participants: Json
          qr_code_url: string | null
          ride_id: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          email_sent?: boolean | null
          id?: string
          participants: Json
          qr_code_url?: string | null
          ride_id?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          email_sent?: boolean | null
          id?: string
          participants?: Json
          qr_code_url?: string | null
          ride_id?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {
      generate_radio_code: { Args: Record<string, never>; Returns: string }
    }
    Enums: {}
    CompositeTypes: {}
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
