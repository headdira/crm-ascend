import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  describeJourneyEvent,
  journeyBrowserChips,
  journeyDetailChips,
  journeyEventIcon,
  type JourneyPayload,
} from "@/lib/landing-journey";

type Props = {
  eventName: string;
  ts: string;
  page: string | null;
  payload: JourneyPayload | null;
};

function ChipGrid({ chips }: { chips: { label: string; value: string }[] }) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {chips.map((chip) => (
        <div
          key={`${chip.label}-${chip.value}`}
          className="rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs"
        >
          <span className="text-muted-foreground">{chip.label}: </span>
          <span className="font-medium text-foreground">{chip.value}</span>
        </div>
      ))}
    </div>
  );
}

export function LeadJourneyEvent({ eventName, ts, page, payload }: Props) {
  const data = (payload ?? {}) as JourneyPayload;
  const description = describeJourneyEvent(eventName, data);
  const details = journeyDetailChips(eventName, data);
  const browser = journeyBrowserChips(data);

  return (
    <li className="rounded-lg border border-border bg-card p-4 text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5" aria-hidden>
          {journeyEventIcon(eventName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-snug text-foreground">{description}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={ts}>{formatDate(ts)}</time>
            {page && (
              <Badge variant="outline" className="font-normal text-[10px]">
                {page}
              </Badge>
            )}
          </div>
          <ChipGrid chips={details} />
          {browser.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Navegador
              </p>
              <ChipGrid chips={browser} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
