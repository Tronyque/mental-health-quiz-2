// lib/database.types.ts
// Types générés à la main pour le schéma RGPD/Metabase actuel.
// Si tu changes le schéma côté Supabase, pense à régénérer ou ajuster ici.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      dimensions: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string; // ex: "q2_3"
          num: number; // 1..38
          text: string;
          dimension_id: number;
          min: number;
          max: number;
          inverted: boolean;
          source: string | null;
        };
        Insert: {
          id: string;
          num: number;
          text: string;
          dimension_id: number;
          min?: number;
          max?: number;
          inverted?: boolean;
          source?: string | null;
        };
        Update: {
          id?: string;
          num?: number;
          text?: string;
          dimension_id?: number;
          min?: number;
          max?: number;
          inverted?: boolean;
          source?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_dimension_id_fkey';
            columns: ['dimension_id'];
            isOneToOne: false;
            referencedRelation: 'dimensions';
            referencedColumns: ['id'];
          },
        ];
      };
      facilities: {
        Row: {
          id: string; // uuid
          name: string;
          created_at: string; // timestamptz
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string; // uuid
          facility_id: string; // uuid
          pseudo_hash: string; // bytea (exposé en base64 par PostgREST)
          job: string;
          age_range: string;
          seniority: string;
          comment: string | null;
          consented: boolean;
          created_at: string; // timestamptz
          client_ip: string | null; // inet
          user_agent: string | null;
          // pseudo_preimage n'est jamais renvoyé (nettoyé par trigger à l'INSERT)
          pseudo_preimage: string | null;
        };
        Insert: {
          id?: string;
          facility_id: string;
          pseudo_hash?: string; // rempli par trigger => inutile de le fournir
          job: string;
          age_range: string;
          seniority: string;
          comment?: string | null;
          consented?: boolean;
          created_at?: string;
          client_ip?: string | null;
          user_agent?: string | null;
          pseudo_preimage: string; // requis à l'insert pour alimenter le trigger
        };
        Update: {
          id?: string;
          facility_id?: string;
          pseudo_hash?: string;
          job?: string;
          age_range?: string;
          seniority?: string;
          comment?: string | null;
          consented?: boolean;
          created_at?: string;
          client_ip?: string | null;
          user_agent?: string | null;
          pseudo_preimage?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'submissions_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      responses: {
        Row: {
          id: number; // bigserial
          submission_id: string; // uuid
          facility_id: string; // uuid
          question_id: string;
          score: number; // 1..5
          created_at: string; // timestamptz
        };
        Insert: {
          id?: number;
          submission_id: string;
          facility_id: string;
          question_id: string;
          score: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          submission_id?: string;
          facility_id?: string;
          question_id?: string;
          score?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'responses_submission_id_fkey';
            columns: ['submission_id'];
            isOneToOne: false;
            referencedRelation: 'submissions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'responses_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'responses_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      vw_submission_dimension_scores: {
        Row: {
          submission_id: string;
          facility_id: string;
          dimension: string;
          n_items: number;
          avg_score: number; // NUMERIC -> number
          submitted_at: string; // timestamptz
        };
        Relationships: [
          {
            foreignKeyName: 'responses_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      vw_facility_dimension_scores: {
        Row: {
          facility_id: string;
          dimension: string;
          n_submissions: number;
          avg_score: number;
        };
        Relationships: [
          {
            foreignKeyName: 'responses_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      vw_facility_daily_activity: {
        Row: {
          facility_id: string;
          day: string; // date
          submissions: number;
          answers: number;
        };
        Relationships: [
          {
            foreignKeyName: 'responses_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      normalize_score: {
        Args: {
          p_value: number;
          p_min: number;
          p_max: number;
          p_inverted: boolean;
        };
        Returns: number;
      };
      submit_quiz: {
        Args: {
          p_facility_id: string; // UUID
          p_answers: Json; // JSONB array [{question_id, score}, ...]
          p_pseudo: string;
          p_job: string;
          p_age_range: string;
          p_seniority: string;
          p_comment?: string | null;
          p_consented?: boolean;
          p_client_ip?: string | null; // inet -> string
          p_user_agent?: string | null;
        };
        Returns: string; // UUID retourné
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: { Enums: {} },
} as const;
