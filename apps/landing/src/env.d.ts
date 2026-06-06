/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APP_URL?: string;
  readonly NEXT_PUBLIC_APP_URL?: string;
  readonly HASH_SALT?: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
  readonly META_PIXEL_ID?: string;
  readonly META_CAPI_ACCESS_TOKEN?: string;
  readonly META_TEST_EVENT_CODE?: string;
  readonly DISCORD_LEAD_WEBHOOK_URL?: string;
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
