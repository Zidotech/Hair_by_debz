/** Smooth-scrolls to the contact form on the About page (used by "Apply for a seat"). */
export function scrollToForm() {
  const f = document.querySelector(".pg form");
  if (f) window.scrollTo({ top: f.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
}

export const APPLY_TOAST = "Tell Debz which programme you’d like in the form";
