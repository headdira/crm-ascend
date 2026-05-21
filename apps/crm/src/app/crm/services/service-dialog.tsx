"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertService } from "@/lib/actions/services";
import { actionErrorMessage } from "@/lib/errors";

type Service = {
  id: string;
  code: string;
  name: string;
  default_priority: string;
  is_active: boolean;
};

export function ServiceDialog({ service }: { service?: Service }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await upsertService({
        id: service?.id,
        code: fd.get("code"),
        name: fd.get("name"),
        default_priority: fd.get("default_priority"),
        is_active: fd.get("is_active") === "true",
      });
      toast.success(service ? "Serviço atualizado" : "Serviço criado");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={service ? "ghost" : "default"} size={service ? "sm" : "default"}>
          {service ? "Editar" : (
            <>
              <Wrench data-icon="inline-start" />
              Novo serviço
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? "Editar serviço" : "Novo serviço"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="code">Código</FieldLabel>
              <Input
                id="code"
                name="code"
                defaultValue={service?.code}
                disabled={!!service}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input id="name" name="name" defaultValue={service?.name} required />
            </Field>
            <Field>
              <FieldLabel>Prioridade padrão</FieldLabel>
              <Select
                name="default_priority"
                defaultValue={service?.default_priority ?? "medium"}
              >
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
              <FieldLabel>Ativo</FieldLabel>
              <Select name="is_active" defaultValue={service?.is_active ? "true" : "false"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Button type="submit">Salvar</Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
