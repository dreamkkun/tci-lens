interface ProgressProps {
  value: number; // 0 ~ 100
}

export function Progress({ value }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line/60">
      <div
        className="h-2 rounded-full bg-coral transition-all duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
