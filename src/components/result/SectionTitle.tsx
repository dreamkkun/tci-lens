interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div>
      <h2 className="text-[22px] font-black leading-tight tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{subtitle}</p>}
    </div>
  );
}
