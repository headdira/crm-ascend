export type { Database, Tables, Enums, Json } from "./database.types";
export type { TablesInsert, TablesUpdate, TablesRow } from "./tables";
export {
  createBrowserSupabase,
  createServerSupabase,
  createServiceSupabase,
} from "./client";
