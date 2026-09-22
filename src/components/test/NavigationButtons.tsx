import { Button } from "@/components/ui/Button";

interface NavigationButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationButtons({
  isFirst,
  isLast,
  canGoNext,
  onPrev,
  onNext,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <Button variant="secondary" onClick={onPrev} disabled={isFirst}>
        이전
      </Button>
      <Button onClick={onNext} disabled={!canGoNext}>
        {isLast ? "결과 분석" : "다음"}
      </Button>
    </div>
  );
}
