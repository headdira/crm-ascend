export type KiwifyLeadQuiz = Record<string, unknown>;

export function kiwifyCheckoutAbandoned(quiz: KiwifyLeadQuiz): boolean {
  return (
    typeof quiz.kiwify_abandoned_at === "string" ||
    quiz.kiwify_checkout_abandoned === true
  );
}

export function kiwifyCheckoutPending(
  quiz: KiwifyLeadQuiz,
  reachedKiwifyAt: string | null,
): boolean {
  if (kiwifyCheckoutAbandoned(quiz)) return false;
  if (quiz.kiwify_checkout_pending === true) return true;
  return Boolean(reachedKiwifyAt && quiz.checkout_completed === true);
}

export function kiwifyLeadBadge(
  quiz: KiwifyLeadQuiz,
  reachedKiwifyAt: string | null,
): { label: string; variant: "destructive" | "secondary" | "outline" } | null {
  if (kiwifyCheckoutAbandoned(quiz)) {
    return { label: "Abandonou checkout Kiwify", variant: "destructive" };
  }
  if (kiwifyCheckoutPending(quiz, reachedKiwifyAt)) {
    return { label: "No checkout Kiwify", variant: "secondary" };
  }
  if (reachedKiwifyAt) {
    return { label: "Foi ao checkout Kiwify", variant: "secondary" };
  }
  return null;
}
