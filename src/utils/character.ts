import { SCALE_META, SCALE_ORDER } from "@/constants/scales";
import { ScaleResult, TCIScale } from "@/types/assessment";

type Side = "HIGH" | "LOW";
type TemperamentScale = "NS" | "HA" | "RD" | "PS";

const TEMPERAMENT_SCALES: TemperamentScale[] = ["NS", "HA", "RD", "PS"];

/** 50%에서 이 이상 벗어나야 "뚜렷한 성향"으로 본다. */
const BALANCED_THRESHOLD = 8;
const SECONDARY_THRESHOLD = 6;
const CAVEAT_THRESHOLD = 12;

interface PoleText {
  /** 2순위 기질일 때 캐릭터 이름 앞부분으로 쓰는 수식어 */
  adjective: string;
  /** 1순위 기질일 때 캐릭터 이름 뒷부분으로 쓰는 유형명 */
  type: string;
  mid: string;
  end: string;
  tip: string;
}

const POLE_TEXT: Record<`${TemperamentScale}_${Side}`, PoleText> = {
  NS_HIGH: {
    adjective: "호기심 폭주",
    type: "탐험가형",
    mid: "새로운 자극에는 일단 발부터 내딛고,",
    end: "낯선 일에서 오히려 에너지를 얻는 사람입니다.",
    tip: "새로운 도전을 즐기는 강점을 살리되, 중요한 결정 앞에서는 위험 요소를 한 번 더 점검해보세요.",
  },
  NS_LOW: {
    adjective: "루틴 수호",
    type: "안정추구형",
    mid: "익숙한 방식을 꾸준히 지켜내고,",
    end: "검증된 길에서 편안함을 느끼는 사람입니다.",
    tip: "안정을 중요하게 여기는 만큼, 익숙한 환경에서 아주 작은 변화부터 시도해보세요.",
  },
  HA_HIGH: {
    adjective: "걱정 레이더",
    type: "안전지향형",
    mid: "위험은 남보다 먼저 감지하고,",
    end: "일이 틀어질 가능성을 미리 챙기는 사람입니다.",
    tip: "걱정이 커질 땐 '지금 당장 해결할 일인지'만 구분해도 한결 가벼워집니다.",
  },
  HA_LOW: {
    adjective: "강심장",
    type: "낙천 대담형",
    mid: "불확실한 상황에서도 크게 긴장하지 않고,",
    end: "웬만한 위기에는 눈 하나 깜빡하지 않는 사람입니다.",
    tip: "대담함이 강점이니, 중요한 일은 체크리스트로 한 번만 더 점검해보세요.",
  },
  RD_HIGH: {
    adjective: "눈치 만렙",
    type: "공감 안테나형",
    mid: "사람들의 기분 변화를 먼저 알아채고,",
    end: "분위기는 누구보다 빨리 읽는 사람입니다.",
    tip: "타인의 반응을 살피는 감각은 강점이니, 결정 앞에서 '내가 원하는 것'을 먼저 적어보세요.",
  },
  RD_LOW: {
    adjective: "마이웨이",
    type: "독립 노선형",
    mid: "남의 시선보다 내 기준을 먼저 세우고,",
    end: "타인의 반응에 쉽게 흔들리지 않는 사람입니다.",
    tip: "자기 기준이 단단한 만큼, 중요한 대화에서는 상대 입장을 한 번 물어보세요.",
  },
  PS_HIGH: {
    adjective: "끈기 끝판왕",
    type: "완주형",
    mid: "한 번 시작한 일은 끝을 보고,",
    end: "힘든 구간에서도 쉽게 포기하지 않는 사람입니다.",
    tip: "끈기가 강점이니, 의도적으로 쉬는 시간을 일정에 넣어 지치지 않게 관리해보세요.",
  },
  PS_LOW: {
    adjective: "미련 없는",
    type: "유연 전환형",
    mid: "안 맞는 길은 미련 없이 갈아타고,",
    end: "상황에 맞춰 방향을 가볍게 바꾸는 사람입니다.",
    tip: "유연함이 강점이니, 꼭 끝내야 할 일 하나만 정해 작게 완주하는 경험을 쌓아보세요.",
  },
};

const CAVEAT: Record<`${TCIScale}_${Side}`, string> = {
  NS_HIGH: "다만 흥미가 식으면 금세 다음 자극을 찾아 나서는 편입니다.",
  NS_LOW: "다만 낯선 시도 앞에서는 한 박자 늦게 움직이는 편입니다.",
  HA_HIGH: "다만 걱정이 커지면 시작하기까지 오래 걸리는 편입니다.",
  HA_LOW: "다만 위험 신호를 가볍게 넘겨 뒤늦게 수습하는 편입니다.",
  RD_HIGH: "다만 남의 반응에 마음이 오래 머무는 편입니다.",
  RD_LOW: "다만 주변의 미묘한 신호를 놓쳐 오해를 살 때가 있습니다.",
  PS_HIGH: "다만 쉬어야 할 때도 끝까지 몰아붙이는 편입니다.",
  PS_LOW: "다만 재미가 사라지면 마무리를 미루는 편입니다.",
  SD_HIGH: "여기에 스스로 방향을 정하고 책임지는 힘까지 갖추고 있습니다.",
  SD_LOW: "다만 결정은 자주 남에게 넘기는 편입니다.",
  CO_HIGH: "여기에 함께 일할 때 더 큰 힘을 내는 협력 감각도 있습니다.",
  CO_LOW: "다만 협력보다는 혼자 해결하는 쪽을 선호하는 편입니다.",
  ST_HIGH: "여기에 자연과 예술 앞에서 깊이 몰입하는 감성도 지니고 있습니다.",
  ST_LOW: "다만 눈에 보이는 현실과 실용을 더 중시하는 편입니다.",
};

export interface CharacterChip {
  scale: TCIScale;
  name: string;
  percentage: number;
  label: "높음" | "보통" | "낮음";
}

export interface CharacterProfile {
  adjective: string;
  type: string;
  description: string;
  chips: CharacterChip[];
  tip: string;
  balanced: boolean;
}

const deviation = (result: ScaleResult) => Math.abs(result.percentage - 50);
const sideOf = (result: ScaleResult): Side => (result.percentage >= 50 ? "HIGH" : "LOW");

function chipLabel(percentage: number): CharacterChip["label"] {
  if (percentage >= 60) return "높음";
  if (percentage <= 40) return "낮음";
  return "보통";
}

export function characterName(profile: Pick<CharacterProfile, "adjective" | "type">): string {
  return `${profile.adjective} ${profile.type}`;
}

/** 50%에서 가장 크게 벗어난 기질 두 개로 캐릭터 이름을, 가장 뚜렷한 나머지 척도로 한 줄 주의점을 만든다. */
export function deriveCharacter(results: Record<TCIScale, ScaleResult>): CharacterProfile {
  const rankedTemperament = [...TEMPERAMENT_SCALES].sort(
    (a, b) => deviation(results[b]) - deviation(results[a])
  );
  const [primaryScale, secondaryScale] = rankedTemperament;
  const primary = results[primaryScale];
  const secondary = results[secondaryScale];

  const chips: CharacterChip[] = [...SCALE_ORDER]
    .sort((a, b) => deviation(results[b]) - deviation(results[a]))
    .slice(0, 3)
    .map((scale) => ({
      scale,
      name: SCALE_META[scale].name,
      percentage: results[scale].percentage,
      label: chipLabel(results[scale].percentage),
    }));

  if (deviation(primary) < BALANCED_THRESHOLD) {
    return {
      adjective: "무난함의 달인",
      type: "균형형",
      description:
        "어느 한쪽으로 크게 기울지 않고 상황에 맞춰 유연하게 반응하는 사람입니다. 특정 성향에 휘둘리지 않는 것이 가장 큰 강점입니다.",
      chips,
      tip: "특정 방향으로 치우치지 않는 만큼, 다양한 환경에 적응하는 능력을 강점으로 활용해보세요.",
      balanced: true,
    };
  }

  const primaryText = POLE_TEXT[`${primaryScale}_${sideOf(primary)}`];
  const secondaryStrong = deviation(secondary) >= SECONDARY_THRESHOLD;
  const secondaryText = POLE_TEXT[`${secondaryScale}_${sideOf(secondary)}`];

  const caveatScale = SCALE_ORDER.filter(
    (scale) => scale !== primaryScale && scale !== secondaryScale
  ).sort((a, b) => deviation(results[b]) - deviation(results[a]))[0];
  const caveat =
    deviation(results[caveatScale]) >= CAVEAT_THRESHOLD
      ? CAVEAT[`${caveatScale}_${sideOf(results[caveatScale])}`]
      : "";

  const description = [
    primaryText.mid,
    secondaryStrong
      ? secondaryText.end
      : "그 밖의 영역에서는 상황에 맞춰 유연하게 움직이는 사람입니다.",
    caveat,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    adjective: secondaryStrong ? secondaryText.adjective : "한결같은",
    type: primaryText.type,
    description,
    chips,
    tip: primaryText.tip,
    balanced: false,
  };
}
