"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteBuilderAsset } from "@/lib/actions/builder";
import { actionErrorMessage } from "@/lib/errors";

export function DeleteBuilderAssetButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Remover "${name}"?`)) return;
    try {
      await deleteBuilderAsset(id);
      toast.success("Asset removido");
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive">
      <Trash2 className="size-4" />
    </Button>
  );
}
