function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Convert simple markdown to HTML (headings, bold, lists, line breaks) */
export function renderMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /^### (.*$)/gm,
      '<h4 class="text-amber-400 mt-3 mb-1">$1</h4>',
    )
    .replace(
      /^## (.*$)/gm,
      '<h3 class="text-amber-400 mt-4 mb-1.5">$1</h3>',
    )
    .replace(
      /^# (.*$)/gm,
      '<h2 class="text-amber-300 mt-5 mb-2">$1</h2>',
    )
    .replace(
      /^[-*] (.*$)/gm,
      '<div class="py-0.5 pl-2 border-l-2 border-white/10">$1</div>',
    )
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}
