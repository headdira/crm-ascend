"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createContract } from "@/lib/actions/contracts";
import { listStudents } from "@/lib/actions/students";
import { listProducts } from "@/lib/actions/products";
import { actionErrorMessage } from "@/lib/errors";

type Line = { product_id: string; quantity: number; unit_price_cents: number };

export default function NewContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetStudent = searchParams.get("student") ?? "";

  const [students, setStudents] = useState<{ id: string; full_name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; sku: string }[]>([]);
  const [studentId, setStudentId] = useState(presetStudent);
  const [lines, setLines] = useState<Line[]>([
    { product_id: "", quantity: 1, unit_price_cents: 0 },
  ]);

  useEffect(() => {
    listStudents().then(setStudents);
    listProducts(true).then(setProducts);
  }, []);

  function addLine() {
    setLines([...lines, { product_id: "", quantity: 1, unit_price_cents: 0 }]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validLines = lines.filter((l) => l.product_id);
    if (!studentId || validLines.length === 0) {
      toast.error("Selecione aluno e ao menos uma linha");
      return;
    }
    try {
      const contract = await createContract({
        student_id: studentId,
        starts_at: String(fd.get("starts_at")),
        ends_at: String(fd.get("ends_at")),
        notes: String(fd.get("notes") || "") || undefined,
        lines: validLines,
      });
      toast.success("Contrato criado");
      router.push(`/crm/contracts/${contract.id}`);
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Novo contrato</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Rascunho</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Aluno</FieldLabel>
                <Select value={studentId} onValueChange={setStudentId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="starts_at">Início</FieldLabel>
                  <Input id="starts_at" name="starts_at" type="date" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="ends_at">Fim</FieldLabel>
                  <Input id="ends_at" name="ends_at" type="date" required />
                </Field>
              </div>
              <Field>
                <FieldLabel>Linhas</FieldLabel>
                <div className="flex flex-col gap-3">
                  {lines.map((line, i) => (
                    <div key={i} className="grid gap-2 md:grid-cols-3">
                      <Select
                        value={line.product_id}
                        onValueChange={(v) => {
                          const next = [...lines];
                          next[i] = { ...next[i], product_id: v };
                          setLines(next);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.sku}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Qtd"
                        value={line.quantity}
                        onChange={(e) => {
                          const next = [...lines];
                          next[i].quantity = Number(e.target.value);
                          setLines(next);
                        }}
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="Preço (centavos)"
                        value={line.unit_price_cents}
                        onChange={(e) => {
                          const next = [...lines];
                          next[i].unit_price_cents = Number(e.target.value);
                          setLines(next);
                        }}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addLine}>
                    Adicionar linha
                  </Button>
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="notes">Notas</FieldLabel>
                <Input id="notes" name="notes" />
              </Field>
              <Button type="submit">Criar rascunho</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
