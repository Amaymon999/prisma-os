import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Client-side Supabase client
export const createClient = () => createClientComponentClient();

// Server-side Supabase client
export const createServerClient = () =>
  createServerComponentClient({ cookies });

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          brand_name: string;
          vertical: string;
          page_type: string;
          status: string;
          wizard_data: Record<string, unknown>;
          generated_html: string | null;
          generated_css: string | null;
          conversion_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
    };
  };
};
