import { TCIScale } from "@/types/assessment";
import { CharacterProfile } from "@/utils/character";

const CHIP_TONE: Record<TCIScale, string> = {
  NS: "bg-peach-soft text-[#9A4A05]",
  HA: "bg-coral-soft text-[#B4232A]",
  RD: "bg-honey-soft text-honey-ink",
  PS: "bg-[#DFF0FF] text-[#1D5FA8]",
  SD: "bg-coral-soft text-[#B4232A]",
  CO: "bg-mint-soft text-mint-ink",
  ST: "bg-[#ECE6FF] text-[#5B3FB3]",
};

interface CharacterHeroProps {
  character: CharacterProfile;
}

export function CharacterHero({ character }: CharacterHeroProps) {
  return (
    <section className="pt-5">
      <p className="text-xs font-bold text-coral">나의 기질 캐릭터</p>
      <h1 className="mt-2 text-[34px] font-black leading-[1.18] tracking-tight">
        {character.adjective}
        <br />
        {character.type}
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{character.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {character.chips.map((chip) => (
          <span
            key={chip.scale}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${CHIP_TONE[chip.scale]}`}
          >
            {chip.name} {chip.scale} {chip.label}
          </span>
        ))}
      </div>
    </section>
  );
}
