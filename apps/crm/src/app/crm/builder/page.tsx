import Link from "next/link";
import { CrmHeader } from "@/components/crm/crm-header";
import { getCurrentStaff } from "@/lib/auth";
import {
  getBuilderSettings,
  listBuilderAssets,
  listBuilderSubmissions,
} from "@/lib/actions/builder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BuilderAssetPreview } from "./builder-asset-preview";
import { BuilderAssetDialog } from "./builder-asset-dialog";
import { BuilderSettingsForm } from "./builder-settings-form";
import { DeleteBuilderAssetButton } from "./delete-builder-asset-button";

export default async function BuilderAdminPage() {
  const staff = await getCurrentStaff();
  const [logos, banners, settings, submissions] = await Promise.all([
    listBuilderAssets("logo"),
    listBuilderAssets("banner"),
    getBuilderSettings(),
    listBuilderSubmissions(),
  ]);

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM", href: "/crm" }, { label: "Builder" }]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Club Builder</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie logos, banners, vídeo e respostas dos clientes.
          </p>
        </div>

        <Tabs defaultValue="logos">
          <TabsList>
            <TabsTrigger value="logos">Logos ({logos.length})</TabsTrigger>
            <TabsTrigger value="banners">Banners ({banners.length})</TabsTrigger>
            <TabsTrigger value="settings">Vídeo &amp; links</TabsTrigger>
            <TabsTrigger value="submissions">Respostas ({submissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="logos" className="space-y-4">
            <div className="flex justify-end">
              <BuilderAssetDialog assetType="logo" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nicho</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {logos.map((logo) => (
                  <TableRow key={logo.id}>
                    <TableCell>
                      <BuilderAssetPreview content={logo.svg_content} />
                    </TableCell>
                    <TableCell>{logo.name}</TableCell>
                    <TableCell>{logo.niche}</TableCell>
                    <TableCell>{logo.sort_order}</TableCell>
                    <TableCell>{logo.is_active ? "Sim" : "Não"}</TableCell>
                    <TableCell className="flex gap-1">
                      <BuilderAssetDialog assetType="logo" asset={logo} />
                      <DeleteBuilderAssetButton id={logo.id} name={logo.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="banners" className="space-y-4">
            <div className="flex justify-end">
              <BuilderAssetDialog assetType="banner" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nicho</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <BuilderAssetPreview content={banner.svg_content} />
                    </TableCell>
                    <TableCell>{banner.name}</TableCell>
                    <TableCell>{banner.niche}</TableCell>
                    <TableCell>{banner.sort_order}</TableCell>
                    <TableCell>{banner.is_active ? "Sim" : "Não"}</TableCell>
                    <TableCell className="flex gap-1">
                      <BuilderAssetDialog assetType="banner" asset={banner} />
                      <DeleteBuilderAssetButton id={banner.id} name={banner.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="settings">
            <BuilderSettingsForm settings={settings} />
          </TabsContent>

          <TabsContent value="submissions">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead>Nicho</TableHead>
                  <TableHead>E-mail loja</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground text-center">
                      Nenhuma resposta ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-xs">
                        {new Date(s.created_at).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell>{s.store_name ?? "—"}</TableCell>
                      <TableCell>{s.niche ?? "—"}</TableCell>
                      <TableCell>{s.store_email ?? "—"}</TableCell>
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
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
