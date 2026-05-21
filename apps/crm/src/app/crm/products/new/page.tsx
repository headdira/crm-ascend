"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, listProducts } from "@/lib/actions/products";
import { actionErrorMessage } from "@/lib/errors";

export default function NewProductPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<{ id: string; name: string; sku: string }[]>([]);
  const [requiresId, setRequiresId] = useState<string>("");

  useEffect(() => {
    listProducts(true).then((items) =>
      setCourses(items.filter((p) => p.product_type === "course")),
    );
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const product = await createProduct({
        sku: fd.get("sku"),
        name: fd.get("name"),
        product_type: fd.get("product_type"),
        description: fd.get("description") || undefined,
        requires_product_id: requiresId || null,
        metadata: fd.get("metadata")
          ? JSON.parse(String(fd.get("metadata")))
          : undefined,
      });
      toast.success("Produto criado");
      router.push(`/crm/products/${product.id}`);
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Novo produto</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Catálogo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sku">SKU</FieldLabel>
                <Input id="sku" name="sku" placeholder="MENT-INDIVIDUAL" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input id="name" name="name" required />
              </Field>
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Select name="product_type" defaultValue="mentorship">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Curso</SelectItem>
                    <SelectItem value="mentorship">Mentoria</SelectItem>
                    <SelectItem value="addon">Add-on</SelectItem>
                    <SelectItem value="bundle">Bundle</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Requer curso (opcional)</FieldLabel>
                <Select value={requiresId} onValueChange={setRequiresId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.sku} — {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
                <Textarea id="description" name="description" />
              </Field>
              <Field>
                <FieldLabel htmlFor="metadata">Metadata (JSON)</FieldLabel>
                <Textarea id="metadata" name="metadata" placeholder="{}" />
              </Field>
              <Button type="submit">Salvar</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
