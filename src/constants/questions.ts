import { Question } from "@/types/assessment";

export const TCI_QUESTIONS: Question[] = [
  // Round 1
  { id: 1, scale: "NS", text: "새롭고 신기한 것을 보면 호기심을 참기 어렵다.", isReverse: false },
  { id: 2, scale: "HA", text: "미래에 나쁜 일이 일어날까 봐 미리 걱정하는 편이다.", isReverse: false },
  { id: 3, scale: "RD", text: "주변 사람들의 기분이나 감정 변화를 빠르게 눈치챈다.", isReverse: false },
  { id: 4, scale: "PS", text: "힘든 장애물이 생겨도 한 번 시작한 일은 포기하지 않는다.", isReverse: false },
  { id: 5, scale: "SD", text: "내 삶의 목표와 방향은 내가 주도적으로 결정한다.", isReverse: false },
  { id: 6, scale: "CO", text: "다른 사람들과 함께 협력할 때 더 큰 즐거움을 느낀다.", isReverse: false },
  { id: 7, scale: "ST", text: "자연이나 예술 작품을 볼 때 깊은 일체감과 경외감을 느낀다.", isReverse: false },

  // Round 2
  { id: 8, scale: "NS", text: "익숙하고 정형화된 방식보다는 색다른 방식을 시도하고 싶다.", isReverse: false },
  { id: 9, scale: "HA", text: "낯선 상황에서도 크게 긴장하지 않고 편안함을 느낀다.", isReverse: true },
  { id: 10, scale: "RD", text: "다른 사람의 평가나 반응에는 별로 신경 쓰지 않는다.", isReverse: true },
  { id: 11, scale: "PS", text: "조금만 힘들어도 하던 일을 쉽게 그만두는 편이다.", isReverse: true },
  { id: 12, scale: "SD", text: "스스로 결정을 내리기보다 다른 사람의 지시를 따르는 것이 더 편하다.", isReverse: true },
  { id: 13, scale: "CO", text: "타인의 어려움에 공감하기보다는 무관심한 편이다.", isReverse: true },
  { id: 14, scale: "ST", text: "눈에 보이지 않는 영적이거나 초월적인 경험에는 관심이 없다.", isReverse: true },

  // Round 3
  { id: 15, scale: "NS", text: "갑작스러운 계획 변경도 오히려 흥미롭게 느껴진다.", isReverse: false },
  { id: 16, scale: "HA", text: "작은 실수에도 크게 불안해지는 편이다.", isReverse: false },
  { id: 17, scale: "RD", text: "누군가에게 거절당하면 오랫동안 마음이 쓰인다.", isReverse: false },
  { id: 18, scale: "PS", text: "목표를 이루기 위해 지루한 반복도 견뎌낼 수 있다.", isReverse: false },
  { id: 19, scale: "SD", text: "실수를 하더라도 그 책임은 내가 진다고 생각한다.", isReverse: false },
  { id: 20, scale: "CO", text: "처음 만난 사람에게도 기본적인 신뢰를 주려고 노력한다.", isReverse: false },
  { id: 21, scale: "ST", text: "우연히 일어난 일에도 의미가 있다고 느낄 때가 많다.", isReverse: false },

  // Round 4
  { id: 22, scale: "NS", text: "위험이 따르더라도 새로운 도전을 피하지 않는 편이다.", isReverse: false },
  { id: 23, scale: "HA", text: "처음 만나는 사람들 앞에서 쉽게 긴장한다.", isReverse: false },
  { id: 24, scale: "RD", text: "따뜻한 말 한마디에도 쉽게 감동받는 편이다.", isReverse: false },
  { id: 25, scale: "PS", text: "성과가 바로 보이지 않아도 꾸준히 노력을 이어간다.", isReverse: false },
  { id: 26, scale: "SD", text: "어려운 상황에서도 스스로 해결책을 찾으려 노력한다.", isReverse: false },
  { id: 27, scale: "CO", text: "공동의 목표를 위해 내 몫보다 더 양보할 수 있다.", isReverse: false },
  { id: 28, scale: "ST", text: "나 자신보다 더 큰 존재나 흐름과 연결되어 있다고 느낄 때가 있다.", isReverse: false },

  // Round 5
  { id: 29, scale: "NS", text: "낯선 시도보다는 검증된 방법을 따르는 것을 선호한다.", isReverse: true },
  { id: 30, scale: "HA", text: "예상치 못한 상황에서도 침착함을 잃지 않는다.", isReverse: true },
  { id: 31, scale: "RD", text: "타인의 인정보다는 자신의 기준이 더 중요하다.", isReverse: true },
  { id: 32, scale: "PS", text: "일이 예상보다 오래 걸리면 금방 흥미를 잃는다.", isReverse: true },
  { id: 33, scale: "SD", text: "다른 사람이 정해준 기준에 따라 행동하는 것이 더 안전하다고 느낀다.", isReverse: true },
  { id: 34, scale: "CO", text: "경쟁에서 이기는 것이 협력보다 더 중요하다고 생각한다.", isReverse: true },
  { id: 35, scale: "ST", text: "신비롭거나 설명하기 어려운 경험은 대부분 비현실적이라고 생각한다.", isReverse: true },
];
