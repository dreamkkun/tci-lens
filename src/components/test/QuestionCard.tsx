import { Question } from "@/types/assessment";

interface QuestionCardProps {
  question: Question;
  selectedValue?: number;
  onSelect: (value: number) => void;
}

const SCALE_LABELS = ["전혀 아니다", "아니다", "보통이다", "그렇다", "매우 그렇다"];

export function QuestionCard({ question, selectedValue, onSelect }: QuestionCardProps) {
  return (
    <div className="space-y-6">
      <p className="min-h-[3.5rem] text-xl font-black leading-relaxed text-ink">
        {question.text}
      </p>

      <div className="grid grid-cols-5 gap-2">
        {SCALE_LABELS.map((label, index) => {
          const value = index + 1;
          const isSelected = selectedValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              aria-pressed={isSelected}
              className={`flex h-12 flex-col items-center justify-center rounded-xl border text-xs font-medium transition-colors sm:h-16 sm:text-sm ${
                isSelected
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink/70 hover:border-coral-line hover:bg-coral-soft"
              }`}
            >
              <span className="text-base font-bold sm:text-lg">{value}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-ink/40 sm:hidden">
        <span>전혀 아니다</span>
        <span>매우 그렇다</span>
      </div>
    </div>
  );
}
