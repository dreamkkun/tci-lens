"use client";

import { useEffect, useState } from "react";
import { Check, Download, Link2, X } from "lucide-react";
import { CharacterProfile } from "@/utils/character";
import { SimulationData } from "@/utils/crisisSimulation";
import { copyText } from "@/utils/clipboard";
import { buildShareUrl } from "@/utils/shareLink";
import { renderStoryCard } from "@/utils/storyImage";

interface StickyActionsProps {
  answers: Record<number, number>;
  character: CharacterProfile;
  simulation: SimulationData;
}

type SaveState = "idle" | "saving" | "failed";
type LinkState = "idle" | "copied" | "failed";

export function StickyActions({ answers, character, simulation }: StickyActionsProps) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [linkState, setLinkState] = useState<LinkState>("idle");
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  // 생성된 카드 이미지의 blob URL. `<a download>` 강제 클릭은 카카오톡 등 인앱
  // 브라우저에서 조용히 실패하는 경우가 많아, 대신 이미지를 화면에 띄워
  // "길게 눌러 저장"(OS 기본 기능)으로 저장하게 한다.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 아래로 스크롤하는 동안은 버튼 바를 숨겨 본문 마지막 줄을 가리지 않게 하고,
  // 위로 스크롤하거나 멈추면(또는 맨 위/맨 아래 근처에서는 항상) 다시 보여준다.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let stopTimer: ReturnType<typeof setTimeout>;

    const scheduleRevealOnStop = () => {
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => setVisible(true), 400);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const nearBottom =
          window.innerHeight + y >= document.documentElement.scrollHeight - 32;

        if (y < 80 || nearBottom) {
          setVisible(true);
        } else if (delta > 6) {
          setVisible(false);
        } else if (delta < -6) {
          setVisible(true);
        }

        lastY = y;
        scheduleRevealOnStop();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(stopTimer);
    };
  }, []);

  // 언마운트 시 blob URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (saveState === "saving") return;
    setSaveState("saving");
    try {
      const blob = await renderStoryCard(character, simulation);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setSaveState("idle");
    } catch (error) {
      console.error("[tci-lens] 카드 생성 실패:", error);
      setSaveState("failed");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  const closePreview = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const handleCopyLink = async () => {
    const url = buildShareUrl(answers, window.location.origin);
    if (!url) {
      setLinkState("failed");
      setTimeout(() => setLinkState("idle"), 2500);
      return;
    }
    const succeeded = await copyText(url);
    setLinkState(succeeded ? "copied" : "failed");
    setManualUrl(succeeded ? null : url);
    setTimeout(() => setLinkState("idle"), 2500);
  };

  const statusMessage =
    saveState === "failed"
      ? "이미지를 만들지 못했어요. 다시 시도해주세요"
      : linkState === "copied"
      ? "결과 링크를 복사했어요"
      : linkState === "failed" && !manualUrl
      ? "링크를 만들지 못했어요"
      : null;

  return (
    <>
      {previewUrl && (
        <div
          role="dialog"
          aria-label="카드 이미지 미리보기"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-5"
          onClick={closePreview}
        >
          <button
            type="button"
            onClick={closePreview}
            aria-label="닫기"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="TCI-Lens 결과 카드"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
          <p className="text-center text-sm font-bold text-white">
            이미지를 길게 눌러 "이미지 저장"을 선택하세요
          </p>
          <a
            href={previewUrl}
            download="tci-lens-story.png"
            onClick={(event) => event.stopPropagation()}
            className="text-xs font-medium text-white/60 underline underline-offset-2"
          >
            대신 다운로드하기
          </a>
        </div>
      )}

      <div
        aria-hidden={!visible}
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-cream via-cream/95 to-transparent pb-5 pt-10 transition-transform duration-300 ease-out sm:pb-8 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="pointer-events-auto mx-auto max-w-[430px] px-5">
          {manualUrl && (
            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-line bg-white p-3 shadow-sm">
              <input
                readOnly
                value={manualUrl}
                onFocus={(event) => event.currentTarget.select()}
                aria-label="결과 링크"
                className="min-w-0 flex-1 bg-transparent text-xs text-ink/70 outline-none"
              />
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setManualUrl(null)}
                className="shrink-0 text-ink/40 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {statusMessage && (
            <p
              role="status"
              className="mb-3 rounded-full bg-ink/90 px-4 py-2 text-center text-xs font-bold text-white"
            >
              {statusMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-bold text-white shadow-lg transition-colors hover:bg-black disabled:opacity-70"
            >
              <Download className="h-5 w-5" />
              {saveState === "saving" ? "카드 만드는 중…" : "카드 저장"}
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="결과 링크 복사"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-ink transition-colors hover:bg-cream"
            >
              {linkState === "copied" ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
