import { Search } from "lucide-react";

interface ResultHeaderProps {
  badge: string;
}

export function ResultHeader({ badge }: ResultHeaderProps) {
  return (
    <header className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-coral text-coral">
          <Search className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <span className="text-lg font-black tracking-tight">TCI-Lens</span>
      </div>
      <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-bold text-ink/70">
        {badge}
      </span>
    </header>
  );
}
