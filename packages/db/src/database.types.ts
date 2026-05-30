export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type TableRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      staff_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: Database["public"]["Enums"]["staff_role"];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          role?: Database["public"]["Enums"]["staff_role"];
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["staff_users"]["Row"]>;
        Relationships: TableRelationship[];
      };
      landing_events: {
        Row: {
          id: string;
          session_id: string;
          event_name: string;
          event_id: string;
          ts: string;
          page: string | null;
          payload: Json;
          meta_capi_status: string;
          meta_capi_error: string | null;
          ga4_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          event_name: string;
          event_id: string;
          ts?: string;
          page?: string | null;
          payload?: Json;
          meta_capi_status?: string;
          meta_capi_error?: string | null;
          ga4_status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["landing_events"]["Row"]>;
        Relationships: TableRelationship[];
      };
      landing_sessions: {
        Row: {
          id: string;
          first_seen: string;
          last_seen: string;
          ip_hash: string | null;
          user_agent: string | null;
          device: string | null;
          os: string | null;
          country: string | null;
          city: string | null;
          utm: Json;
          referrer: string | null;
          landing_path: string | null;
        };
        Insert: {
          id: string;
          first_seen?: string;
          last_seen?: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          device?: string | null;
          os?: string | null;
          country?: string | null;
          city?: string | null;
          utm?: Json;
          referrer?: string | null;
          landing_path?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["landing_sessions"]["Row"]>;
        Relationships: TableRelationship[];
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email_hash: string;
          phone_hash: string | null;
          email_enc: string | null;
          phone_enc: string | null;
          source: string;
          utm: Json;
          quiz_answers: Json;
          status: Database["public"]["Enums"]["lead_status"];
          owner_id: string | null;
          converted_student_id: string | null;
          session_id: string | null;
          reached_kiwify_at: string | null;
          last_event_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email_hash: string;
          phone_hash?: string | null;
          email_enc?: string | null;
          phone_enc?: string | null;
          source?: string;
          utm?: Json;
          quiz_answers?: Json;
          status?: Database["public"]["Enums"]["lead_status"];
          owner_id?: string | null;
          converted_student_id?: string | null;
          session_id?: string | null;
          reached_kiwify_at?: string | null;
          last_event_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
        Relationships: TableRelationship[];
      };
      students: {
        Row: {
          id: string;
          full_name: string;
          email_hash: string;
          phone_hash: string | null;
          document_hash: string | null;
          email: string | null;
          phone: string | null;
          document: string | null;
          status: Database["public"]["Enums"]["student_status"];
          converted_from_lead_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email_hash: string;
          phone_hash?: string | null;
          document_hash?: string | null;
          email?: string | null;
          phone?: string | null;
          document?: string | null;
          status?: Database["public"]["Enums"]["student_status"];
          converted_from_lead_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["students"]["Row"]>;
        Relationships: TableRelationship[];
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          product_type: Database["public"]["Enums"]["product_type"];
          description: string;
          is_active: boolean;
          requires_product_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          product_type: Database["public"]["Enums"]["product_type"];
          description?: string;
          is_active?: boolean;
          requires_product_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: TableRelationship[];
      };
      contracts: {
        Row: {
          id: string;
          student_id: string;
          status: Database["public"]["Enums"]["contract_status"];
          starts_at: string;
          ends_at: string;
          total_amount_cents: number;
          currency: string;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          status?: Database["public"]["Enums"]["contract_status"];
          starts_at: string;
          ends_at: string;
          total_amount_cents?: number;
          currency?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contracts"]["Row"]>;
        Relationships: TableRelationship[];
      };
      contract_lines: {
        Row: {
          id: string;
          contract_id: string;
          product_id: string;
          quantity: number;
          unit_price_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          product_id: string;
          quantity?: number;
          unit_price_cents: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contract_lines"]["Row"]>;
        Relationships: TableRelationship[];
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          product_id: string;
          contract_line_id: string | null;
          status: Database["public"]["Enums"]["enrollment_status"];
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          product_id: string;
          contract_line_id?: string | null;
          status?: Database["public"]["Enums"]["enrollment_status"];
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Row"]>;
        Relationships: TableRelationship[];
      };
      services: {
        Row: {
          id: string;
          code: string;
          name: string;
          default_priority: Database["public"]["Enums"]["case_priority"];
          is_active: boolean;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          default_priority?: Database["public"]["Enums"]["case_priority"];
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Relationships: TableRelationship[];
      };
      cases: {
        Row: {
          id: string;
          student_id: string;
          contract_id: string | null;
          service_id: string;
          subject: string;
          description: string;
          status: Database["public"]["Enums"]["case_status"];
          priority: Database["public"]["Enums"]["case_priority"];
          owner_id: string | null;
          builder_submission_id: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          contract_id?: string | null;
          service_id: string;
          subject: string;
          description?: string;
          status?: Database["public"]["Enums"]["case_status"];
          priority?: Database["public"]["Enums"]["case_priority"];
          owner_id?: string | null;
          builder_submission_id?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["cases"]["Row"]>;
        Relationships: TableRelationship[];
      };
      case_comments: {
        Row: {
          id: string;
          case_id: string;
          author_id: string;
          body: string;
          is_internal: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          author_id: string;
          body: string;
          is_internal?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["case_comments"]["Row"]>;
        Relationships: TableRelationship[];
      };
      form_definitions: {
        Row: {
          id: string;
          slug: string;
          name: string;
          schema: Json;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          schema?: Json;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["form_definitions"]["Row"]>;
        Relationships: TableRelationship[];
      };
      form_submissions: {
        Row: {
          id: string;
          form_id: string;
          student_id: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          student_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["form_submissions"]["Row"]>;
        Relationships: TableRelationship[];
      };
      builder_assets: {
        Row: {
          id: string;
          asset_type: Database["public"]["Enums"]["builder_asset_type"];
          name: string;
          niche: string;
          svg_content: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_type: Database["public"]["Enums"]["builder_asset_type"];
          name: string;
          niche: string;
          svg_content: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["builder_assets"]["Row"]>;
        Relationships: TableRelationship[];
      };
      builder_settings: {
        Row: {
          id: number;
          youtube_url: string | null;
          affiliate_url: string | null;
          updated_at: string;
        };
        Insert: {
          id: number;
          youtube_url?: string | null;
          affiliate_url?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["builder_settings"]["Row"]>;
        Relationships: TableRelationship[];
      };
      builder_submissions: {
        Row: {
          id: string;
          payload: Json;
          store_name: string | null;
          niche: string | null;
          course_email: string | null;
          store_email: string | null;
          oauth_session_id: string | null;
          provision_status: Database["public"]["Enums"]["builder_provision_status"];
          provision_job_id: string | null;
          provision_error: string | null;
          store_preview_url: string | null;
          nuvemshop_store_id: string | null;
          theme_assets: Json | null;
          case_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          payload?: Json;
          store_name?: string | null;
          niche?: string | null;
          course_email?: string | null;
          store_email?: string | null;
          oauth_session_id?: string | null;
          provision_status?: Database["public"]["Enums"]["builder_provision_status"];
          provision_job_id?: string | null;
          provision_error?: string | null;
          store_preview_url?: string | null;
          nuvemshop_store_id?: string | null;
          theme_assets?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["builder_submissions"]["Row"]>;
        Relationships: TableRelationship[];
      };
    };
    Views: {};
    Functions: {
      insert_builder_submission: {
        Args: {
          p_store_name: string;
          p_niche: string;
          p_course_email: string | null;
          p_store_email: string;
          p_oauth_session_id: string;
          p_payload: Json;
        };
        Returns: string;
      };
      update_builder_submission_provision: {
        Args: {
          p_id: string;
          p_provision_status: Database["public"]["Enums"]["builder_provision_status"];
          p_provision_job_id?: string | null;
          p_provision_error?: string | null;
          p_store_preview_url?: string | null;
          p_nuvemshop_store_id?: string | null;
          p_theme_assets?: Json | null;
        };
        Returns: undefined;
      };
    };
    Enums: {
      lead_status:
        | "new"
        | "frio"
        | "quente"
        | "contacted"
        | "qualified"
        | "disqualified"
        | "converted";
      student_status: "prospect" | "active" | "inactive";
      product_type: "course" | "mentorship" | "addon" | "bundle" | "other";
      contract_status: "draft" | "active" | "suspended" | "ended" | "cancelled";
      enrollment_status: "pending" | "active" | "suspended" | "ended";
      case_status: "new" | "in_progress" | "waiting_customer" | "resolved" | "closed";
      case_priority: "low" | "medium" | "high" | "critical";
      staff_role: "admin" | "sales" | "support" | "finance" | "read_only";
      builder_asset_type: "logo" | "banner";
      builder_provision_status:
        | "pending"
        | "queued"
        | "running"
        | "completed"
        | "failed";
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
