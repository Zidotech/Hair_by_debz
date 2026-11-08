/**
 * After a failed submit, bring the first visible error into view (and focus its field),
 * so people on a phone aren't left at the bottom wondering why the button did nothing.
 * Call it right after setting the error state; it waits a moment for the errors to render.
 */
export function scrollToFirstError(delay = 90) {
  window.setTimeout(() => {
    const alerts = Array.from(document.querySelectorAll<HTMLElement>("main [role='alert']")).filter((a) => a.getClientRects().length > 0);
    const first = alerts[0];
    if (!first) return;
    const wrap = first.parentElement;
    const target = wrap && wrap.getBoundingClientRect().height < 420 ? wrap : first;
    const y = target.getBoundingClientRect().top + window.scrollY - 110; // clear the sticky header
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    wrap?.querySelector<HTMLElement>("input[aria-invalid='true'],textarea[aria-invalid='true'],select[aria-invalid='true']")?.focus({ preventScroll: true });
  }, delay);
}
