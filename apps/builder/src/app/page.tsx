import { BuilderWizard } from "@/components/builder-wizard";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 bg-[radial-gradient(ellipse_at_top,#27272a_0%,#09090b_55%,#000000_100%)]">
      <BuilderWizard />
    </div>
  );
}
