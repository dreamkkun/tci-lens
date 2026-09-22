import { ScaleResult, TCIScale } from "@/types/assessment";

export type Stance = "HIGH" | "LOW";
export type TemperamentTrait = "NS" | "HA" | "RD" | "PS";

const TEMPERAMENT_ORDER: TemperamentTrait[] = ["NS", "HA", "RD", "PS"];

const BUBBLE_SIDE: Record<TemperamentTrait, "left" | "right"> = {
  NS: "right",
  HA: "left",
  RD: "left",
  PS: "right",
};

interface ScenarioTemplate {
  tabLabel: string;
  situationTitle: string;
  scene: string;
  dialogues: Record<TemperamentTrait, Record<Stance, { thought: string }>>;
  dominant: Record<TemperamentTrait, { verdict: string; viral: string }>;
}

const SCENARIOS: ScenarioTemplate[] = [
  {
    tabLabel: "당일 취소",
    situationTitle: "약속 30분 전, 친구에게서 온 '오늘 못 갈 것 같아' 문자",
    scene: `이미 옷 갈아입고 현관에서 신발을 신는 순간 울린 문자 "미안, 오늘 좀 어려울 것 같아ㅠㅠ"`,
    dialogues: {
      NS: {
        HIGH: { thought: "오히려 좋아! 갑자기 생긴 빈 시간에 혼자 새로운 데나 가볼까?" },
        LOW: { thought: "하... 계획이 다 틀어졌네. 오늘은 그냥 집에 있어야겠다." },
      },
      HA: {
        HIGH: { thought: "혹시 무슨 일 생긴 건 아니겠지? 괜히 걱정된다..." },
        LOW: { thought: "그럴 수도 있지 뭐. 크게 신경 쓸 일은 아니야." },
      },
      RD: {
        HIGH: { thought: "내가 뭘 서운하게 했나? 서운해도 티 내면 분위기 어색해지겠지..." },
        LOW: { thought: "취소면 취소지, 이유까지 캐묻고 싶지 않아. 내 시간 쓰면 되지." },
      },
      PS: {
        HIGH: { thought: "다시 날짜부터 잡아야겠다. 이번 주 안에 꼭 만나야지." },
        LOW: { thought: "다음에 보면 되지, 굳이 날짜 다시 안 잡아도 돼." },
      },
    },
    dominant: {
      NS: {
        verdict: "그럼 오늘은 혼자 새로운 곳 가보자!",
        viral: "자극추구가 이겨서 약속 취소에도 혼자 탐험 떠나는 사람 나야 나",
      },
      HA: {
        verdict: "무슨 일 있는 건 아닌지, 일단 안부부터 물어보자.",
        viral: "위험회피가 이겨서 약속 취소에도 상대 걱정부터 하는 사람 나야 나",
      },
      RD: {
        verdict: '서운하지만... "괜찮아~ 다음에 보자!"라고 보내자.',
        viral: "사회적민감성이 이겨서 서운해도 괜찮다고 답장하는 사람 나야 나",
      },
      PS: {
        verdict: "이번 주 안에 다시 날짜부터 잡아두자.",
        viral: "인내력이 이겨서 취소된 약속도 끝까지 다시 잡는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "읽씹",
    situationTitle: "중요한 톡을 보냈는데, 3시간째 '읽씹' 당하는 중",
    scene: `전송한 지 3시간, 숫자 1은 사라졌는데 답장은 여전히 오지 않는다`,
    dialogues: {
      NS: {
        HIGH: {
          thought: "차라리 전화해서 무슨 일인지 바로 확인해버릴까? 답답하게 기다리는 거 못 견디겠어.",
        },
        LOW: { thought: "뭐, 답장 오면 오는 거지. 딴 거 하면서 잊고 있으면 되지." },
      },
      HA: {
        HIGH: { thought: "혹시 내가 뭔가 잘못 말했나? 화났나? 괜히 걱정되네..." },
        LOW: { thought: "바쁜가 보지, 뭐. 답장 늦는 거로 크게 신경 쓸 일은 아니야." },
      },
      RD: {
        HIGH: {
          thought: "내가 너무 매달리는 것처럼 보이면 어쩌지? 근데 무시당한 것 같아서 서운하기도 하고...",
        },
        LOW: { thought: "답장이 늦든 말든 딱히 신경 안 써. 내 할 일이나 하자." },
      },
      PS: {
        HIGH: {
          thought: "일단 내가 할 일부터 끝내고, 나중에 정중하게 한 번 더 물어봐야지.",
        },
        LOW: { thought: "에이 모르겠다, 그냥 신경 끄고 넘어가자." },
      },
    },
    dominant: {
      NS: {
        verdict: "궁금해서 진짜 못 참겠다, 그냥 전화해버리자!",
        viral: "자극추구가 이겨서 결국 3시간 만에 전화 거는 사람 나야 나",
      },
      HA: {
        verdict: "괜히 걱정만 쌓이니까, 그냥 조용히 기다려보자.",
        viral: "위험회피가 앞서서 걱정만 하다 결국 그냥 기다리는 사람 나야 나",
      },
      RD: {
        verdict: "서운한 마음이 커서... 그래도 한 번 더 안부를 남겨볼까.",
        viral: "사회적민감성이 이겨서 서운함에 다시 톡 보내는 사람 나야 나",
      },
      PS: {
        verdict: "일단 내 할 일부터 끝내놓고, 나중에 차분히 다시 물어보자.",
        viral: "인내력이 앞서서 묵묵히 기다리다 나중에 다시 묻는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "잘못 나온 음료",
    situationTitle: "카페에서 주문한 것과 다른 음료가 나왔다",
    scene: `자리에 앉아 한 모금 마셨는데, 분명 아이스 아메리카노를 시켰는데 달달한 라떼 맛이 난다`,
    dialogues: {
      NS: {
        HIGH: { thought: "어? 원래 안 마시던 맛인데 오히려 새로운 걸로 도전해볼까?" },
        LOW: { thought: "내가 시킨 그 맛이 마시고 싶었는데... 익숙한 게 제일 좋은데." },
      },
      HA: {
        HIGH: { thought: "말했다가 분위기 어색해지면 어떡하지... 그냥 마실까?" },
        LOW: { thought: "다르게 나왔으면 말하면 되지, 별거 아니야." },
      },
      RD: {
        HIGH: { thought: "직원분 바빠 보이는데 미안해서 말 못 하겠다... 까다로워 보일까 봐." },
        LOW: { thought: "직원이 어떻게 생각하든 상관없어, 내가 시킨 걸 받아야지." },
      },
      PS: {
        HIGH: { thought: "돈 낸 건 제대로 받아야지. 끝까지 정정해서 받아가자." },
        LOW: { thought: "다시 말하기 귀찮아, 그냥 마시고 가자." },
      },
    },
    dominant: {
      NS: {
        verdict: "이왕 이렇게 된 거 새로운 맛 도전해보자!",
        viral: "자극추구가 이겨서 잘못 나온 음료도 즐겁게 마시는 사람 나야 나",
      },
      HA: {
        verdict: "말했다가 어색해지느니 그냥 마시고 넘어가자.",
        viral: "위험회피가 이겨서 잘못 나온 음료를 조용히 마시는 사람 나야 나",
      },
      RD: {
        verdict: "직원분 바빠 보이는데... 그냥 마시자.",
        viral: "사회적민감성이 이겨서 잘못 나온 음료에도 '괜찮아요' 하는 사람 나야 나",
      },
      PS: {
        verdict: "내가 시킨 건 제대로 받아야지, 정중하게 말하자.",
        viral: "인내력이 이겨서 끝까지 내가 시킨 음료 받아내는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "축가 부탁",
    situationTitle: "친구 결혼식, 갑작스러운 축가 부탁을 받았다",
    scene: `결혼식 3일 전, 신랑 친구가 조심스레 묻는다 "혹시 축가 한 곡만 불러줄 수 있어?"`,
    dialogues: {
      NS: {
        HIGH: { thought: "무대에 서는 거 재밌겠는데? 오랜만에 노래 불러볼까!" },
        LOW: { thought: "굳이 내가? 그냥 축하만 하고 조용히 있고 싶은데." },
      },
      HA: {
        HIGH: {
          thought: "사람들 앞에서 음 이탈 나면 어떡하지... 연습할 시간도 없는데.",
        },
        LOW: { thought: "뭐 틀려도 그게 뭐 대수야, 그냥 즐기면 되지." },
      },
      RD: {
        HIGH: {
          thought: "친구가 나 믿고 부탁한 건데 거절하면 서운해하겠지...",
        },
        LOW: { thought: "하고 싶으면 하고 아니면 마는 거지, 부담 가질 필요 없어." },
      },
      PS: {
        HIGH: { thought: "일단 맡았으니 끝까지 연습해서 제대로 불러야지." },
        LOW: { thought: "대충 준비해서 그냥 넘기면 되지, 완벽하게 안 해도 돼." },
      },
    },
    dominant: {
      NS: {
        verdict: "오랜만에 무대 서는 거, 그냥 즐겨보자!",
        viral: "자극추구가 이겨서 갑자기 축가 콜한 사람 나야 나",
      },
      HA: {
        verdict: "실수할까 봐 걱정되니까, 연습을 몇 번이라도 더 해두자.",
        viral: "위험회피가 이겨서 축가 앞두고 밤새 연습하는 사람 나야 나",
      },
      RD: {
        verdict: "친구 부탁을 거절 못 하겠다... 그냥 해주자.",
        viral: "사회적민감성이 이겨서 결국 축가 수락하는 사람 나야 나",
      },
      PS: {
        verdict: "맡은 이상 끝까지 제대로 준비해서 불러야지.",
        viral: "인내력이 이겨서 축가 하나에도 끝까지 진지한 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "배달 지연",
    situationTitle: "배달 앱 예상 시간이 벌써 세 번째 늘어났다",
    scene: `40분이라던 배달이 어느새 1시간 반, 앱에는 "조금만 더 기다려 주세요"만 떠 있다`,
    dialogues: {
      NS: {
        HIGH: { thought: "그냥 취소하고 근처에서 새로운 가게 찾아 걸어가볼까?" },
        LOW: { thought: "기다리는 거 뭐, 하던 거 하면서 오면 먹으면 되지." },
      },
      HA: {
        HIGH: { thought: "혹시 주문이 잘못 들어간 건 아니겠지? 너무 굶어서 컨디션 망치겠다..." },
        LOW: { thought: "조금 늦을 수도 있지, 크게 문제될 건 없어." },
      },
      RD: {
        HIGH: { thought: "기사님도 힘드실 텐데 재촉하면 미안하잖아... 별점 깎기도 미안하고." },
        LOW: { thought: "늦은 건 늦은 거지, 고객센터에 바로 말할 거야." },
      },
      PS: {
        HIGH: { thought: "여기까지 기다렸으니 끝까지 기다려서 받자. 취소하면 그동안이 아깝잖아." },
        LOW: { thought: "이 정도 기다렸으면 됐어, 미련 없이 취소하고 다른 거 먹자." },
      },
    },
    dominant: {
      NS: {
        verdict: "기다리지 말고 지금 당장 다른 맛집 찾아 나가자!",
        viral: "자극추구가 이겨서 배달 지연에 바로 뛰쳐나가는 사람 나야 나",
      },
      HA: {
        verdict: "이러다 컨디션 망가지니, 일단 간단하게 뭐라도 먹어두자.",
        viral: "위험회피가 이겨서 배달 기다리다 비상식량 꺼내는 사람 나야 나",
      },
      RD: {
        verdict: "기사님도 힘드실 텐데... 조금만 더 기다려보자.",
        viral: "사회적민감성이 이겨서 배달이 늦어도 재촉 못 하는 사람 나야 나",
      },
      PS: {
        verdict: "여기까지 기다렸으니 끝까지 기다려서 받자.",
        viral: "인내력이 이겨서 배달을 끝까지 기다려 받아내는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "PT 권유",
    situationTitle: "헬스장에서 1년 치 PT를 즉석 할인해준다는 제안을 받았다",
    scene: `러닝머신에서 내려오자 트레이너가 웃으며 다가온다 "오늘만 특별 할인인데, 상담 잠깐 받아보실래요?"`,
    dialogues: {
      NS: {
        HIGH: {
          thought: "이 가격에 이 조건이면 지금 바로 등록해야 해! 놓치면 아쉽잖아.",
        },
        LOW: { thought: "뭐 굳이 지금 결정해야 하나, 나중에 생각해보고 싶은데." },
      },
      HA: {
        HIGH: {
          thought: "1년 치나 되는 돈을 지금 바로 써도 괜찮을까... 괜히 후회할까 봐 걱정된다.",
        },
        LOW: { thought: "어차피 운동할 거면 미리 끊어두는 게 낫지, 크게 걱정 안 해." },
      },
      RD: {
        HIGH: {
          thought: "상담사가 계속 웃으면서 권하는데 거절하면 미안해지네...",
        },
        LOW: { thought: "상담사 반응은 신경 안 써, 내가 필요 없으면 안 하는 거지." },
      },
      PS: {
        HIGH: { thought: "등록하면 끝까지 꾸준히 다녀서 본전 뽑아야지." },
        LOW: { thought: "등록해도 며칠 다니다 안 갈 게 뻔한데... 그냥 넘기자." },
      },
    },
    dominant: {
      NS: {
        verdict: "이 조건이면 지금 등록해야지, 놓치면 아깝잖아!",
        viral: "자극추구가 이겨서 즉석에서 1년치 PT 결제하는 사람 나야 나",
      },
      HA: {
        verdict: "큰돈이니까 좀 더 생각해보고 결정하자.",
        viral: "위험회피가 이겨서 결제 직전에 마음 접는 사람 나야 나",
      },
      RD: {
        verdict: "상담사가 저렇게까지 권하는데... 그냥 등록해주자.",
        viral: "사회적민감성이 이겨서 분위기에 밀려 결제하는 사람 나야 나",
      },
      PS: {
        verdict: "등록하는 김에 끝까지 꾸준히 다녀서 본전 뽑자.",
        viral: "인내력이 이겨서 결제 순간부터 완주 계획 짜는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "빌려준 돈",
    situationTitle: "친구에게 빌려준 돈, 두 달째 아무 말이 없다",
    scene: `단톡방에 올라온 친구의 여행 사진, 그런데 빌려간 돈 얘기는 두 달째 감감무소식`,
    dialogues: {
      NS: {
        HIGH: { thought: "그냥 확 돈 얘기 꺼내서 시원하게 정리해버릴까?" },
        LOW: { thought: "뭐 언젠가 갚겠지, 지금 굳이 신경 쓰고 싶지 않다." },
      },
      HA: {
        HIGH: {
          thought: "괜히 돈 얘기 꺼냈다가 관계가 어색해지면 어쩌지... 말하기가 무섭다.",
        },
        LOW: { thought: "돈이야 돈이고 편하게 얘기하면 되지, 뭐가 걱정이야." },
      },
      RD: {
        HIGH: {
          thought: "돈 얘기 꺼내면 나를 쪼잔하게 볼까... 그냥 참는 게 나을 것 같다.",
        },
        LOW: { thought: "내가 빌려준 돈인데 그런 눈치까지 볼 필요는 없지." },
      },
      PS: {
        HIGH: {
          thought: "언젠가는 꼭 정리해야 할 일이니, 적당한 때를 봐서 끝까지 얘기해야지.",
        },
        LOW: { thought: "그냥 넘어가는 게 편하지, 굳이 끝까지 따질 필요 있나." },
      },
    },
    dominant: {
      NS: {
        verdict: "그냥 확 얘기 꺼내서 시원하게 정리해버리자!",
        viral: "자극추구가 이겨서 돈 얘기 직진으로 꺼내는 사람 나야 나",
      },
      HA: {
        verdict: "관계 어색해질까 봐 무서우니, 이번에도 그냥 넘기자.",
        viral: "위험회피가 이겨서 두 달째 말 못 꺼내는 사람 나야 나",
      },
      RD: {
        verdict: "쪼잔하게 보일까 봐... 그냥 참자.",
        viral: "사회적민감성이 이겨서 빌려준 돈 얘기도 못 꺼내는 사람 나야 나",
      },
      PS: {
        verdict: "언젠가는 정리해야 하니, 적당한 때를 봐서 꼭 얘기하자.",
        viral: "인내력이 이겨서 두 달을 벼르다 결국 얘기 꺼내는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "약속 정하기",
    situationTitle: "친구 단톡방, 아무도 이번 주말 약속을 정하지 않는다",
    scene: `"이번 주말 뭐 하지?" 다들 읽고 조용한 단톡방, 결국 모두가 나를 기다리는 것 같다`,
    dialogues: {
      NS: {
        HIGH: { thought: "이번엔 안 가본 곳으로 가자! 내가 새로운 장소 찾아볼게." },
        LOW: { thought: "늘 가던 데 가면 되지, 굳이 새로 찾기 귀찮다." },
      },
      HA: {
        HIGH: { thought: "내가 정했다가 별로면 어쩌지... 다들 실망할까 봐 걱정된다." },
        LOW: { thought: "별로면 다음에 다른 데 가면 되지, 일단 정하자." },
      },
      RD: {
        HIGH: { thought: "다들 뭘 원하는지 눈치 보이네... 아무도 불편하지 않은 날짜를 찾아야 해." },
        LOW: { thought: "내가 가고 싶은 데 제안하면 되지, 싫으면 말하겠지." },
      },
      PS: {
        HIGH: { thought: "결국 내가 나서서 투표라도 만들어서 끝까지 정리해야겠다." },
        LOW: { thought: "누가 정하겠지, 계속 기다리다 안 되면 말지 뭐." },
      },
    },
    dominant: {
      NS: {
        verdict: "안 가본 곳으로 내가 정해서 던져보자!",
        viral: "자극추구가 이겨서 단톡방에 새 장소 던지는 사람 나야 나",
      },
      HA: {
        verdict: "별로일까 봐 걱정되니... 일단 다른 사람이 정하길 기다려보자.",
        viral: "위험회피가 이겨서 약속 장소 결정을 미루는 사람 나야 나",
      },
      RD: {
        verdict: "다들 편한 날짜부터 물어보고 맞춰보자.",
        viral: "사회적민감성이 이겨서 모두의 일정부터 챙기는 사람 나야 나",
      },
      PS: {
        verdict: "그냥 내가 투표 만들어서 끝까지 정리하자.",
        viral: "인내력이 이겨서 결국 약속 총대 메는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "지하철 소음",
    situationTitle: "지하철 옆자리 사람의 이어폰 소리가 너무 크다",
    scene: `만원 지하철, 옆자리에서 새어 나오는 노래가 10분째 귀에 꽂힌다`,
    dialogues: {
      NS: {
        HIGH: { thought: "차라리 다음 역에서 내려서 다른 칸으로 옮겨볼까!" },
        LOW: { thought: "그냥 자리 그대로 있자, 옮기는 것도 귀찮다." },
      },
      HA: {
        HIGH: { thought: "말했다가 괜히 시비 붙으면 어떡하지... 그냥 참는 게 안전하겠지?" },
        LOW: { thought: "정중하게 소리만 줄여달라고 하면 되지, 별일 아니야." },
      },
      RD: {
        HIGH: { thought: "말하면 저 사람이 민망해할 텐데... 다들 쳐다보는 것도 신경 쓰이고." },
        LOW: { thought: "다른 사람 시선은 상관없어, 시끄러우면 말할 거야." },
      },
      PS: {
        HIGH: { thought: "몇 정거장만 참으면 되니까 그냥 버텨야지." },
        LOW: { thought: "이 소음 못 참겠다, 지금 당장 어떻게든 해결해야겠어." },
      },
    },
    dominant: {
      NS: {
        verdict: "다음 역에서 내려서 다른 칸으로 옮겨버리자!",
        viral: "자극추구가 이겨서 소음 피해 칸 옮기는 사람 나야 나",
      },
      HA: {
        verdict: "괜히 시비 붙느니 조용히 참고 가자.",
        viral: "위험회피가 이겨서 지하철 소음도 조용히 참는 사람 나야 나",
      },
      RD: {
        verdict: "저 사람도 민망할 텐데... 그냥 넘어가자.",
        viral: "사회적민감성이 이겨서 소음에도 눈치 보며 참는 사람 나야 나",
      },
      PS: {
        verdict: "몇 정거장만 더 참으면 되니까 끝까지 버텨보자.",
        viral: "인내력이 이겨서 소음도 끝까지 버텨내는 사람 나야 나",
      },
    },
  },
  {
    tabLabel: "디저트 뷔페",
    situationTitle: "다이어트 중인데, 친구가 디저트 뷔페를 예약했다",
    scene: `3주째 식단을 지키는 중인데, 친구가 신나게 외친다 "오늘 디저트 뷔페 예약했어!"`,
    dialogues: {
      NS: {
        HIGH: { thought: "새로운 디저트들 다 궁금한데? 오늘만 즐기자!" },
        LOW: { thought: "뭐 디저트야 늘 비슷하지, 그렇게 안 궁금하다." },
      },
      HA: {
        HIGH: {
          thought: "먹으면 다이어트 다 망칠 것 같은데... 괜히 불안하다.",
        },
        LOW: { thought: "하루 좀 먹는다고 크게 달라지겠어, 걱정 안 해." },
      },
      RD: {
        HIGH: {
          thought: "나만 안 먹으면 분위기 깨겠지? 다들 먹는데 나도 맞춰야 할 것 같다.",
        },
        LOW: { thought: "다들 먹든 말든 난 내 계획대로 할 거야." },
      },
      PS: {
        HIGH: {
          thought: "힘들게 지켜온 다이어트니까, 오늘 하루도 끝까지 참아야지.",
        },
        LOW: { thought: "어차피 다이어트도 오래 못 갈 텐데, 오늘은 그냥 먹자." },
      },
    },
    dominant: {
      NS: {
        verdict: "새로운 디저트들 다 궁금하니까, 오늘만 즐기자!",
        viral: "자극추구가 이겨서 다이어트 중에도 디저트 뷔페 즐기는 사람 나야 나",
      },
      HA: {
        verdict: "다이어트 망칠까 봐 불안하니, 오늘은 참자.",
        viral: "위험회피가 이겨서 디저트 앞에서도 꾹 참는 사람 나야 나",
      },
      RD: {
        verdict: "다들 먹는데 나만 안 먹으면 분위기 깨질까 봐... 조금만 맞춰 먹자.",
        viral: "사회적민감성이 이겨서 분위기 맞추다 다이어트 접는 사람 나야 나",
      },
      PS: {
        verdict: "힘들게 지켜온 만큼, 오늘 하루도 끝까지 참아내자.",
        viral: "인내력이 이겨서 디저트 뷔페 앞에서도 끝까지 버티는 사람 나야 나",
      },
    },
  },
];

export const SCENARIO_COUNT = SCENARIOS.length;
export const SCENARIO_TAB_LABELS: string[] = SCENARIOS.map((scenario) => scenario.tabLabel);

export interface SimBubble {
  scale: TemperamentTrait;
  label: string;
  db: number;
  stance: Stance;
  thought: string;
  side: "left" | "right";
}

export interface SimulationData {
  tabLabel: string;
  title: string;
  scene: string;
  bubbles: SimBubble[];
  loudest: {
    scale: TemperamentTrait;
    label: string;
    db: number;
    verdict: string;
    viral: string;
  };
}

export interface ChemistryCard {
  tone: "good" | "caution";
  badge: string;
  title: string;
  tag: string;
  stars: number;
  sections: { heading: string; lines: string[] }[];
}

export interface PrescriptionData {
  tag: string;
  subtitle: string;
  trigger: string;
  steps: { label: string; text: string }[];
}

export interface CrisisExtras {
  loudestLabel: string;
  chemistry: { good: ChemistryCard; caution: ChemistryCard };
  prescription: PrescriptionData;
}

const CHEMISTRY_TEMPLATES: Record<
  TemperamentTrait,
  { good: ChemistryCard; caution: ChemistryCard }
> = {
  NS: {
    good: {
      tone: "good",
      badge: "환상의 짝꿍",
      title: "든든한 브레이크 메이커",
      tag: "고HA + 고PS형",
      stars: 5,
      sections: [
        {
          heading: "왜 찰떡인가요?",
          lines: [
            "내가 벌인 즉흥 계획의 빈틈을 미리 짚어줍니다.",
            "들뜬 나를 말리기보다 속도만 살짝 늦춰줍니다.",
            "시작만 하고 흩어진 일을 끝까지 이어가도록 도와줍니다.",
          ],
        },
      ],
    },
    caution: {
      tone: "caution",
      badge: "주의 요망 짝꿍",
      title: "안전제일 잔소리꾼",
      tag: "고HA + 저NS형",
      stars: 1,
      sections: [
        {
          heading: "주의 포인트",
          lines: ['새 아이디어를 꺼낼 때마다 "그거 위험하지 않아?"가 돌아와 의욕이 꺾입니다.'],
        },
        {
          heading: "갈등 완화 팁",
          lines: ["계획을 말할 때 최악의 경우 대비책 한 줄을 함께 공유하세요."],
        },
      ],
    },
  },
  HA: {
    good: {
      tone: "good",
      badge: "환상의 짝꿍",
      title: "결단력 있는 디렉터",
      tag: "고SD형",
      stars: 5,
      sections: [
        {
          heading: "왜 찰떡인가요?",
          lines: [
            "선택지가 많을수록 흔들리는 나 대신 방향을 먼저 정해줍니다.",
            '눈치 보느라 못 꺼낸 의견도 "이건 이렇게 가자"로 정리해줍니다.',
            "걱정을 꺼내면 결론부터 묻는 사람이라 불안이 오래 머물지 않습니다.",
          ],
        },
      ],
    },
    caution: {
      tone: "caution",
      badge: "주의 요망 짝꿍",
      title: "불도저 독불장군",
      tag: "고NS + 저CO형",
      stars: 1,
      sections: [
        {
          heading: "주의 포인트",
          lines: ['속도를 밀어붙이는 사람 앞에서 "괜찮아요"만 반복하다 혼자 지칩니다.'],
        },
        {
          heading: "갈등 완화 팁",
          lines: [
            '동의하기 전에 "하루만 생각해볼게요"라고 말하고, 걱정되는 점 1가지만 문장으로 전하세요.',
          ],
        },
      ],
    },
  },
  RD: {
    good: {
      tone: "good",
      badge: "환상의 짝꿍",
      title: "흔들림 없는 균형추",
      tag: "저RD + 고SD형",
      stars: 5,
      sections: [
        {
          heading: "왜 찰떡인가요?",
          lines: [
            "내가 눈치 보느라 에너지를 쓸 때 기준을 대신 잡아줍니다.",
            "거절해도 관계는 끊기지 않는다는 걸 몸소 보여줍니다.",
            '"너는 어때?"를 먼저 물어봐 줘서 내 의견을 꺼낼 자리가 생깁니다.',
          ],
        },
      ],
    },
    caution: {
      tone: "caution",
      badge: "주의 요망 짝꿍",
      title: "눈치 제로 직진러",
      tag: "저RD + 고NS형",
      stars: 1,
      sections: [
        {
          heading: "주의 포인트",
          lines: ["무심코 던진 한마디에 나만 오래 상처받고 혼자 삭이게 됩니다."],
        },
        {
          heading: "갈등 완화 팁",
          lines: ['서운함이 생기면 그날 안에 "그 말이 이렇게 들렸어요"라고 짧게 전하세요.'],
        },
      ],
    },
  },
  PS: {
    good: {
      tone: "good",
      badge: "환상의 짝꿍",
      title: "느긋한 휴식 메이트",
      tag: "저PS + 저HA형",
      stars: 5,
      sections: [
        {
          heading: "왜 찰떡인가요?",
          lines: [
            '끝까지 붙잡고 있는 나에게 "오늘은 여기까지"를 알려줍니다.',
            "완벽하지 않아도 괜찮다는 걸 가볍게 보여줍니다.",
            "쉬는 시간에도 죄책감이 들지 않게 함께 놀아줍니다.",
          ],
        },
      ],
    },
    caution: {
      tone: "caution",
      badge: "주의 요망 짝꿍",
      title: "벌려놓기 대장",
      tag: "고NS + 저PS형",
      stars: 1,
      sections: [
        {
          heading: "주의 포인트",
          lines: ["시작만 하고 마무리는 나에게 넘겨 조용히 지치게 됩니다."],
        },
        {
          heading: "갈등 완화 팁",
          lines: ['일을 나누기 전에 "어디까지가 내 몫인지"를 먼저 합의하세요.'],
        },
      ],
    },
  },
};

const PRESCRIPTION_TEMPLATES: Record<TemperamentTrait, Omit<PrescriptionData, "tag">> = {
  NS: {
    subtitle: "높은 자극추구(NS)는 충동 뒤에 후회와 피로가 몰려오기 쉽습니다.",
    trigger: '"일단 질러!" 충동이 올라와 결정을 내리기 직전일 때',
    steps: [
      { label: "STEP 1 · 충동 멈춤", text: "결제·수락 버튼 앞에서 손을 떼고 물 한 컵을 천천히 마십니다." },
      {
        label: "STEP 2 · 욕구 분리",
        text: "'재밌겠다'와 '지금 몸 상태 괜찮다'를 노트에 따로 한 줄씩 적어봅니다.",
      },
      {
        label: "STEP 3 · 유예 규칙",
        text: "10분 뒤에도 하고 싶다면 그때 실행하고, 오늘 에너지는 70%만 쓰기로 정합니다.",
      },
    ],
  },
  HA: {
    subtitle: "높은 위험회피(HA)는 불안이 쌓이면 번아웃으로 이어지기 쉽습니다.",
    trigger: "불안감이 급격히 올라 멘탈이 방전되기 직전일 때",
    steps: [
      { label: "STEP 1 · 신체 진정", text: "4초 들이쉬고 7초 멈추고 8초 내쉬기 호흡을 3세트 진행합니다." },
      {
        label: "STEP 2 · 불안 분리",
        text: "일어날 확률 5% 미만인 최악의 상상을 노트에 3줄 적고 덮습니다.",
      },
      {
        label: "STEP 3 · 선택 제한",
        text: "오늘 결정할 일 중 1개만 남기고 나머지는 내일 오전 10시로 미룹니다.",
      },
    ],
  },
  RD: {
    subtitle: "높은 사회적민감성(RD)은 눈치를 보다 내 감정이 뒤로 밀리기 쉽습니다.",
    trigger: "남의 표정이 신경 쓰여 내 의견을 삼키기 직전일 때",
    steps: [
      {
        label: "STEP 1 · 사실 확인",
        text: "'저 표정이 정말 내 탓일까?'를 스스로에게 묻고, 확인된 사실만 한 줄 적습니다.",
      },
      {
        label: "STEP 2 · 마음 분리",
        text: "'내가 원해서'인지 '거절이 두려워서'인지 결정 이유를 둘 중 하나로 표시합니다.",
      },
      {
        label: "STEP 3 · 작은 선택",
        text: "오늘 딱 하나만 눈치 보지 않고 내 마음대로 고르는 연습을 합니다.",
      },
    ],
  },
  PS: {
    subtitle: "높은 인내력(PS)은 쉬는 타이밍을 놓쳐 조용히 소진되기 쉽습니다.",
    trigger: '"끝까지 해야 해"라는 생각에 멈추지 못하고 몰아붙일 때',
    steps: [
      { label: "STEP 1 · 강제 휴지", text: "하던 일을 내려놓고 타이머 5분 동안 아무것도 하지 않습니다." },
      {
        label: "STEP 2 · 생각 비교",
        text: "'끝까지 해야 한다'와 '지금 쉬어도 된다'를 나란히 적고 근거를 비교해봅니다.",
      },
      {
        label: "STEP 3 · 할 일 덜기",
        text: "오늘 목록에서 딱 1개를 지우고 그 자리에 휴식 시간을 적어 넣습니다.",
      },
    ],
  },
};

function stanceOf(result: ScaleResult): Stance {
  return result.percentage >= 50 ? "HIGH" : "LOW";
}

/** 점수(dB)가 큰 기질 3개를 큰 순서로 고른다. 이 3개가 시뮬레이션에 목소리를 낸다. */
export function pickSimulationTraits(
  results: Record<TCIScale, ScaleResult>
): TemperamentTrait[] {
  return [...TEMPERAMENT_ORDER]
    .sort((a, b) => results[b].percentage - results[a].percentage)
    .slice(0, 3);
}

/** 같은 검사 결과라면 항상 같은 시나리오가 처음에 뜨도록, 점수에서 결정론적으로 인덱스를 고른다. */
export function defaultScenarioIndex(results: Record<TCIScale, ScaleResult>): number {
  const seed = TEMPERAMENT_ORDER.reduce((sum, trait) => sum + results[trait].percentage, 0);
  return seed % SCENARIO_COUNT;
}

export function buildScenarioSimulation(
  results: Record<TCIScale, ScaleResult>,
  scenarioIndex: number
): SimulationData {
  const scenario = SCENARIOS[((scenarioIndex % SCENARIO_COUNT) + SCENARIO_COUNT) % SCENARIO_COUNT];
  const picked = pickSimulationTraits(results);

  const bubbles: SimBubble[] = TEMPERAMENT_ORDER.filter((trait) => picked.includes(trait)).map(
    (trait) => {
      const result = results[trait];
      const stance = stanceOf(result);
      return {
        scale: trait,
        label: `${result.scaleName} (${trait})`,
        db: result.percentage,
        stance,
        thought: scenario.dialogues[trait][stance].thought,
        side: BUBBLE_SIDE[trait],
      };
    }
  );

  const loudestTrait = picked[0];
  const dominant = scenario.dominant[loudestTrait];

  return {
    tabLabel: scenario.tabLabel,
    title: scenario.situationTitle,
    scene: scenario.scene,
    bubbles,
    loudest: {
      scale: loudestTrait,
      label: `${results[loudestTrait].scaleName}(${loudestTrait})`,
      db: results[loudestTrait].percentage,
      verdict: dominant.verdict,
      viral: dominant.viral,
    },
  };
}

export function buildCrisisExtras(results: Record<TCIScale, ScaleResult>): CrisisExtras {
  const loudestTrait = pickSimulationTraits(results)[0];
  const prescription = PRESCRIPTION_TEMPLATES[loudestTrait];
  const prefix = results[loudestTrait].percentage >= 50 ? "고 " : "";

  return {
    loudestLabel: `${results[loudestTrait].scaleName}(${loudestTrait})`,
    chemistry: CHEMISTRY_TEMPLATES[loudestTrait],
    prescription: { ...prescription, tag: `${prefix}${loudestTrait} 맞춤` },
  };
}
