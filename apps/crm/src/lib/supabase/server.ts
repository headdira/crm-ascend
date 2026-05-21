import { createServerSupabase, type Database } from "@crm-ascend/db";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type CrmSupabase = SupabaseClient<Database>;

export async function getSupabaseServer(): Promise<CrmSupabase> {
  const cookieStore = await cookies();
  const client = await createServerSupabase({
    getAll: () =>
      cookieStore.getAll().map((c) => ({ name: c.name, value: c.value })),
    set: (name, value, options) => {
      cookieStore.set(name, value, options);
    },
    remove: (name, options) => {
      cookieStore.set(name, "", { ...options, maxAge: 0 });
    },
  });
  return client as unknown as CrmSupabase;
}
