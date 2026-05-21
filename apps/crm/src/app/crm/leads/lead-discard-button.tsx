"use client";

import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { discardLead } from "@/lib/actions/leads";
import { actionErrorMessage } from "@/lib/errors";

export function LeadDiscardButton({ leadId }: { leadId: string }) {
  const router = useRouter();

  async function handleDiscard() {
    try {
      await discardLead(leadId);
      toast.success("Lead descartado");
      router.refresh();
    } catch (e) {
      toast.error(actionErrorMessage(e));
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDiscard}>
      <Ban data-icon="inline-start" />
      Descartar
    </Button>
  );
}
