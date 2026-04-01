import { cn } from "@/lib/utils";

interface DataPulseProps {
  label?: string;
  className?: string;
}

export function DataPulse({ label, className }: DataPulseProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      {label && (
        <span className="meta-label text-primary">{label}</span>
      )}
    </span>
  );
}
