"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SectionTitle } from "@/components/result/SectionTitle";
import { PrescriptionData } from "@/utils/crisisSimulation";

interface PrescriptionSectionProps {
  data: PrescriptionData;
}

export function PrescriptionSection({ data }: PrescriptionSectionProps) {
  const [checked, setChecked] = useState<boolean[]>(() => data.steps.map(() => false));
  const done = checked.filter(Boolean).length;

  const toggle = (index: number) =>
    setChecked((current) => current.map((value, i) => (i === index ? !value : value)));

  return (
    <section className="space-y-3">
      <SectionTitle title="멘탈 방전 시 처방전" subtitle={data.subtitle} />

      <div className="rounded-3xl bg-navy p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-coral px-3 py-1 text-xs font-bold">{data.tag}</span>
          <span className="text-xs font-bold text-white/60">
            {done}/{data.steps.length} 완료
          </span>
        </div>

        <p className="mt-4 text-base font-black text-[#FF8A8E]">이럴 때 꺼내세요</p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-white/85">{data.trigger}</p>

        <ul className="mt-4 space-y-2.5">
          {data.steps.map((step, index) => (
            <li key={step.label}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-pressed={checked[index]}
                className="flex w-full items-start gap-3 rounded-2xl bg-white/10 p-4 text-left transition-colors hover:bg-white/15"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                    checked[index] ? "border-coral bg-coral" : "border-white/70"
                  }`}
                >
                  {checked[index] && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                </span>
                <span>
                  <span className="block text-[11px] font-bold text-[#FF8A8E]">{step.label}</span>
                  <span
                    className={`mt-1 block text-[14px] font-medium leading-snug ${
                      checked[index] ? "text-white/45 line-through" : "text-white"
                    }`}
                  >
                    {step.text}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
