"use client";

import { useRouter } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { activateContract } from "@/lib/actions/contracts";
import { actionErrorMessage } from "@/lib/errors";

export function ActivateContractButton({ contractId }: { contractId: string }) {
  const router = useRouter();

  async function handleActivate() {
    try {
      await activateContract({ contract_id: contractId });
      toast.success("Contrato ativado — matrículas criadas");
      router.refresh();
    } catch (e) {
      toast.error(actionErrorMessage(e));
    }
  }

  return (
    <Button onClick={handleActivate}>
      <PlayCircle data-icon="inline-start" />
      Ativar contrato
    </Button>
  );
}
