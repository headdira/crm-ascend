import Link from "next/link";
import { FileSignature, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CrmHeader } from "@/components/crm/crm-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { getCurrentStaff } from "@/lib/auth";
import { getStudent360 } from "@/lib/actions/students";
import { formatCents, formatDate } from "@/lib/utils";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getCurrentStaff();
  const { student, contracts, enrollments, cases } = await getStudent360(id);

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Alunos", href: "/crm/students" },
          { label: student.full_name },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{student.full_name}</h1>
            <StatusBadge value={student.status} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/crm/contracts/new?student=${id}`}>
                <FileSignature data-icon="inline-start" />
                Novo contrato
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/crm/cases?student=${id}`}>
                <LifeBuoy data-icon="inline-start" />
                Novo caso
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="perfil">
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
            <TabsTrigger value="casos">Casos</TabsTrigger>
          </TabsList>
          <TabsContent value="perfil">
            <Card>
              <CardContent className="flex flex-col gap-2 pt-6 text-sm">
                {student.email && (
                  <p>
                    <span className="text-muted-foreground">E-mail:</span> {student.email}
                  </p>
                )}
                {student.phone && (
                  <p>
                    <span className="text-muted-foreground">Telefone:</span> {student.phone}
                  </p>
                )}
                {student.notes && (
                  <p>
                    <span className="text-muted-foreground">Notas:</span> {student.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contratos">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contratos</CardTitle>
              </CardHeader>
              <CardContent>
                {contracts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Sem contratos.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <Link href={`/crm/contracts/${c.id}`} className="hover:underline">
                              <StatusBadge value={c.status} />
                            </Link>
                          </TableCell>
                          <TableCell>
                            {c.starts_at} — {c.ends_at}
                          </TableCell>
                          <TableCell>{formatCents(c.total_amount_cents)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="matriculas">
            <Card>
              <CardContent className="pt-6">
                {enrollments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Sem matrículas.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((e) => {
                        const p = e.products as { name: string; sku: string } | null;
                        return (
                          <TableRow key={e.id}>
                            <TableCell>{p?.name}</TableCell>
                            <TableCell>{p?.sku}</TableCell>
                            <TableCell>
                              <StatusBadge value={e.status} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="casos">
            <Card>
              <CardContent className="pt-6">
                {cases.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Sem casos.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assunto</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cases.map((c) => {
                        const svc = c.services as { name: string } | null;
                        return (
                          <TableRow key={c.id}>
                            <TableCell>
                              <Link href={`/crm/cases/${c.id}`} className="hover:underline">
                                {c.subject}
                              </Link>
                            </TableCell>
                            <TableCell>{svc?.name}</TableCell>
                            <TableCell>
                              <StatusBadge value={c.status} />
                            </TableCell>
                            <TableCell>{formatDate(c.created_at)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
