import type { CSSProperties } from "react";

type AdSlotShellProps = {
  readonly slotId: string;
  readonly label?: string;
  readonly minHeight?: number;
};

export default function AdSlotShell({
  slotId,
  label = "Advertisement",
  minHeight = 250
}: AdSlotShellProps) {
  const style = {
    "--ad-slot-min-height": `${Math.max(0, minHeight)}px`
  } as CSSProperties;

  return (
    <aside className="ad-slot-shell" aria-label={label} data-ad-slot={slotId} style={style}>
      <span>{label}</span>
    </aside>
  );
}
