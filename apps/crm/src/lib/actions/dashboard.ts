"use server";

import { getSupabaseServer } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await getSupabaseServer();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [leadsRes, studentsRes, casesRes, contractsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new")
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("cases")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "in_progress", "waiting_customer"]),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
  ]);

  return {
    newLeads7d: leadsRes.count ?? 0,
    activeStudents: studentsRes.count ?? 0,
    openCases: casesRes.count ?? 0,
    draftContracts: contractsRes.count ?? 0,
  };
}
