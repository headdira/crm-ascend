"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addCaseComment, updateCase } from "@/lib/actions/cases";
import { actionErrorMessage } from "@/lib/errors";

export function CaseDetailForm({
  caseId,
  initial,
  staffList,
}: {
  caseId: string;
  initial: { status: string; priority: string; owner_id: string | null };
  staffList: { id: string; full_name: string }[];
}) {
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updateCase(caseId, {
        status: String(fd.get("status")),
        priority: String(fd.get("priority")),
        owner_id: String(fd.get("owner_id") || "") || null,
      });
      toast.success("Caso atualizado");
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  async function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = String(fd.get("body"));
    if (!body.trim()) return;
    try {
      await addCaseComment({ case_id: caseId, body });
      toast.success("Comentário adicionado");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleUpdate}>
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select name="status" defaultValue={initial.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "new",
                  "in_progress",
                  "waiting_customer",
                  "resolved",
                  "closed",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Prioridade</FieldLabel>
            <Select name="priority" defaultValue={initial.priority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["low", "medium", "high", "critical"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Responsável</FieldLabel>
            <Select name="owner_id" defaultValue={initial.owner_id ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Nenhum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                {staffList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button type="submit" size="sm">
            Salvar status
          </Button>
        </FieldGroup>
      </form>
      <form onSubmit={handleComment}>
        <FieldGroup className="max-w-lg">
          <Field>
            <FieldLabel htmlFor="body">Novo comentário</FieldLabel>
            <Textarea id="body" name="body" rows={3} required />
          </Field>
          <Button type="submit" size="sm">
            Publicar
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
