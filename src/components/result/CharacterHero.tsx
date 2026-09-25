import { TCIScale } from "@/types/assessment";
import { CharacterProfile } from "@/utils/character";

// 크림색 페이지 배경 위에 바로 놓이는 칩이라, 옅은 배경색만으로는 배경과 잘
// 구분되지 않는다. 톤별 line 컬러로 테두리를 둘러 경계를 뚜렷하게 만든다.
const CHIP_TONE: Record<TCIScale, string> = {
  NS: "border border-peach-line bg-peach-soft text-[#9A4A05]",
  HA: "border border-coral-line bg-coral-soft text-[#B4232A]",
  RD: "border border-honey-line bg-honey-soft text-honey-ink",
  PS: "border border-[#A9CDF5] bg-[#DFF0FF] text-[#1D5FA8]",
  SD: "border border-coral-line bg-coral-soft text-[#B4232A]",
  CO: "border border-mint-line bg-mint-soft text-mint-ink",
  ST: "border border-[#C7B8F0] bg-[#ECE6FF] text-[#5B3FB3]",
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
