import { Search } from "lucide-react";

/** lg(1024px)부터만 보이는 좌측 워터마크. 로고 아이콘을 크게 회전시켜 깔아
 *  둬서, 430px 콘텐츠 양옆이 빈 화면처럼 보이지 않게 한다. 콘텐츠와 겹치지
 *  않도록 1024px 기준으로도 여유 있게 크기를 잡았다. */
export function DesktopWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-10 top-1/2 hidden -translate-y-1/2 -rotate-12 lg:block"
    >
      <Search className="h-[220px] w-[220px] text-coral opacity-[0.07]" strokeWidth={1} />
    </div>
  );
}

interface DesktopPromoProps {
  isShared: boolean;
}

/** 우측 여백의 홍보 카피. 공유된 결과를 보는 사람에게는 "나도 해보기"를,
 *  본인 결과를 보는 사람에게는 "공유하기"를 자연스럽게 권한다. */
export function DesktopPromo({ isShared }: DesktopPromoProps) {
  return (
    <aside className="pointer-events-none fixed right-10 top-1/2 hidden w-[220px] -translate-y-1/2 lg:block">
      <p className="text-xs font-bold text-coral">TCI-Lens</p>
      <h2 className="mt-3 text-xl font-black leading-tight tracking-tight text-ink">
        {isShared ? (
          <>
            이 결과, 나도
            <br />
            확인해볼까?
          </>
        ) : (
          <>
            친구에게도
            <br />
            공유해보세요
          </>
        )}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        표준 TCI 모델 기반 7개 척도로 알아보는 나의 기질·성격. 위기 상황 시뮬레이션까지 5분이면 충분해요.
      </p>
      <a
        href="/"
        className="pointer-events-auto mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-black"
      >
        나도 검사해보기 →
      </a>
    </aside>
  );
}
