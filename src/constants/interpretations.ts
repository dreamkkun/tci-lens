import { ScoreLevel, TCIScale } from "@/types/assessment";

interface LevelText {
  summary: string;
  description: string;
}

export const SCALE_INTERPRETATIONS: Record<TCIScale, Record<ScoreLevel, LevelText>> = {
  NS: {
    HIGH: {
      summary: "새로움을 즐기는 탐색가",
      description: "새롭고 자극적인 상황을 적극적으로 찾고, 낯선 시도를 즐기며 쉽게 지루해하지 않습니다.",
    },
    MID: {
      summary: "균형 잡힌 호기심",
      description: "적절한 수준의 새로움을 추구하며, 익숙함과 새로움 사이에서 균형을 유지합니다.",
    },
    LOW: {
      summary: "안정과 익숙함을 선호",
      description: "예측 가능하고 익숙한 환경을 선호하며, 충동적인 변화보다 신중한 유지를 택합니다.",
    },
  },
  HA: {
    HIGH: {
      summary: "신중한 걱정형",
      description: "위험과 불확실성에 민감하게 반응하며, 미리 대비하고 조심스럽게 행동하는 경향이 있습니다.",
    },
    MID: {
      summary: "상황에 맞춘 경계심",
      description: "상황에 따라 조심스러움과 대담함을 적절히 조절할 수 있습니다.",
    },
    LOW: {
      summary: "낙천적인 대담가",
      description: "불확실한 상황에서도 크게 긴장하지 않고, 자신감 있게 행동하는 경향이 있습니다.",
    },
  },
  RD: {
    HIGH: {
      summary: "관계에 민감한 공감가",
      description: "타인의 감정과 사회적 신호에 민감하며, 인정과 애착을 중요하게 여깁니다.",
    },
    MID: {
      summary: "적정 수준의 관계 민감성",
      description: "타인의 반응을 살피면서도 자신의 기준을 함께 유지합니다.",
    },
    LOW: {
      summary: "독립적인 실용주의자",
      description: "타인의 평가에 크게 흔들리지 않고 자신의 판단을 우선하는 경향이 있습니다.",
    },
  },
  PS: {
    HIGH: {
      summary: "끈기 있는 완주자",
      description: "장애물이 있어도 목표를 향해 꾸준히 나아가며, 쉽게 포기하지 않습니다.",
    },
    MID: {
      summary: "유연한 지속력",
      description: "상황에 따라 끈기와 유연한 전환을 적절히 오갈 수 있습니다.",
    },
    LOW: {
      summary: "유연한 전환가",
      description: "어려움에 부딪히면 방향을 빠르게 전환하는 것을 선호하는 경향이 있습니다.",
    },
  },
  SD: {
    HIGH: {
      summary: "주도적인 자기결정가",
      description: "스스로 목표를 설정하고 책임지며, 삶의 방향을 능동적으로 이끌어갑니다.",
    },
    MID: {
      summary: "성장 중인 자율성",
      description: "자기주도성과 타인 의존 사이에서 균형점을 찾아가는 과정에 있습니다.",
    },
    LOW: {
      summary: "의존적 결정 스타일",
      description: "스스로 결정하기보다 타인의 조언이나 지시에 기대는 경향이 있습니다.",
    },
  },
  CO: {
    HIGH: {
      summary: "협력적인 연대가",
      description: "타인과의 협력과 공감을 중요하게 여기며, 공동체 안에서 편안함을 느낍니다.",
    },
    MID: {
      summary: "선택적 협력가",
      description: "상황에 따라 협력과 독립적 행동을 적절히 선택합니다.",
    },
    LOW: {
      summary: "독자적인 개인주의자",
      description: "타인과의 협력보다 독립적인 행동과 판단을 우선하는 경향이 있습니다.",
    },
  },
  ST: {
    HIGH: {
      summary: "초월적 의미 추구자",
      description: "자연, 예술, 영적 경험 속에서 깊은 일체감과 경외감을 자주 느낍니다.",
    },
    MID: {
      summary: "가끔의 경외감",
      description: "일상 속에서 가끔씩 초월적이거나 경이로운 순간을 경험합니다.",
    },
    LOW: {
      summary: "현실적인 실용가",
      description: "눈에 보이는 현실과 실용적 가치에 더 무게를 두는 경향이 있습니다.",
    },
  },
};
