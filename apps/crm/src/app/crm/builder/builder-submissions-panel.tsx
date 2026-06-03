"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listBuilderSubmissions, type BuilderSubmission } from "@/lib/actions/builder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BuilderSubmissionsPanel() {
  const [rows, setRows] = useState<BuilderSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listBuilderSubmissions()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erro ao carregar");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }

  if (!rows) {
    return <p className="text-muted-foreground text-sm">Carregando respostas…</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Loja</TableHead>
          <TableHead>Nicho</TableHead>
          <TableHead>E-mail loja</TableHead>
          <TableHead>Caso</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-muted-foreground text-center">
              Nenhuma resposta ainda.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="text-xs">
                {new Date(s.created_at).toLocaleString("pt-BR")}
              </TableCell>
              <TableCell>{s.store_name ?? "—"}</TableCell>
              <TableCell>{s.niche ?? "—"}</TableCell>
              <TableCell>{s.store_email ?? "—"}</TableCell>
              <TableCell>
                {"case_id" in s && s.case_id ? (
                  <Link href={`/crm/cases/${s.case_id}`} className="text-primary text-sm hover:underline">
                    Abrir
                  </Link>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
              <TableCell>
                <Link
                  href={`/crm/builder/submissions/${s.id}`}
                  className="text-primary text-sm hover:underline"
                >
                  Ver detalhes
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
