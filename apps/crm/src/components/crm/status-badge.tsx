import { Badge } from "@/components/ui/badge";

const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  qualified: "outline",
  disqualified: "destructive",
  converted: "secondary",
  prospect: "outline",
  active: "default",
  inactive: "secondary",
  draft: "outline",
  suspended: "secondary",
  ended: "secondary",
  cancelled: "destructive",
  pending: "outline",
  in_progress: "default",
  waiting_customer: "secondary",
  resolved: "secondary",
  closed: "outline",
  low: "outline",
  medium: "secondary",
  high: "default",
  critical: "destructive",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant={variants[value] ?? "outline"} className="capitalize">
      {value.replace(/_/g, " ")}
    </Badge>
  );
}
