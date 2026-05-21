"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { convertLeadToStudent } from "@/lib/actions/leads";
import { actionErrorMessage } from "@/lib/errors";

export function ConvertLeadDialog({
  leadId,
  leadName,
}: {
  leadId: string;
  leadName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
    setLoading(true);
    try {
      const { student } = await convertLeadToStudent({ lead_id: leadId });
      toast.success("Lead convertido em aluno");
      setOpen(false);
      router.push(`/crm/students/${student.id}`);
    } catch (e) {
      toast.error(actionErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserCheck data-icon="inline-start" />
          Converter para aluno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Converter lead</DialogTitle>
          <DialogDescription>
            Criar aluno a partir de <strong>{leadName}</strong>? Esta ação não pode ser
            desfeita se já existir aluno com o mesmo e-mail.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConvert} disabled={loading}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
