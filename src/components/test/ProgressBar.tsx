import { Progress } from "@/components/ui/Progress";

interface ProgressBarProps {
  current: number; // 1-based
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm text-ink/50">
        <span>
          현재 <span className="font-black text-ink">{current}</span> / 전체 {total}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
