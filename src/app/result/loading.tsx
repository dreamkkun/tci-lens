export default function ResultLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-coral-soft border-t-coral" />
        <p className="text-sm font-bold text-ink/70">
          응답을 분석해서 결과를 만들고 있어요.
          <br />
          잠시만 기다려주세요…
        </p>
      </div>
    </main>
  );
}
