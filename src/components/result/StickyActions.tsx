"use client";

import { useEffect, useRef, useState } from "react";
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

type SaveState = "idle" | "saving" | "done" | "failed";
type LinkState = "idle" | "copied" | "failed";

export function StickyActions({ answers, character, simulation }: StickyActionsProps) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [linkState, setLinkState] = useState<LinkState>("idle");
  const [manualUrl, setManualUrl] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (saveState === "saving") return;
    setSaveState("saving");
    try {
      const blob = await renderStoryCard(character, simulation);

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "tci-lens-story.png";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaveState("done");
    } catch {
      setSaveState("failed");
    }
    setTimeout(() => setSaveState("idle"), 2500);
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
    saveState === "done"
      ? "카드를 저장했어요"
      : saveState === "failed"
      ? "이미지 저장에 실패했어요. 다시 시도해주세요"
      : linkState === "copied"
      ? "결과 링크를 복사했어요"
      : linkState === "failed" && !manualUrl
      ? "링크를 만들지 못했어요"
      : null;

  return (
    <>
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
              {saveState === "saving" ? "카드 저장 중…" : "카드 저장"}
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
