"use client";

import { useState } from "react";
import type { BuilderAsset, BuilderSettings } from "@/lib/actions/builder";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuilderAssetsGallery } from "./builder-assets-gallery";
import { BuilderSettingsForm } from "./builder-settings-form";
import { BuilderSubmissionsPanel } from "./builder-submissions-panel";

export function BuilderAdminTabs({
  logos,
  banners,
  settings,
}: {
  logos: BuilderAsset[];
  banners: BuilderAsset[];
  settings: BuilderSettings;
}) {
  const [tab, setTab] = useState("banners");

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/60 p-1">
        <TabsTrigger value="banners">Banners ({banners.length})</TabsTrigger>
        <TabsTrigger value="logos">Logos ({logos.length})</TabsTrigger>
        <TabsTrigger value="settings">Vídeo &amp; links</TabsTrigger>
        <TabsTrigger value="submissions">Respostas</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        {tab === "banners" && <BuilderAssetsGallery assets={banners} assetType="banner" />}
        {tab === "logos" && <BuilderAssetsGallery assets={logos} assetType="logo" />}
        {tab === "settings" && <BuilderSettingsForm settings={settings} />}
        {tab === "submissions" && <BuilderSubmissionsPanel />}
      </div>
    </Tabs>
  );
}
