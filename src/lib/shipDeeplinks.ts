/** Cursor opens the desktop app; web link works from any browser. */
export function buildCursorDeeplinks(text: string): { app: string; web: string } {
  const q = new URLSearchParams({ text });
  return {
    app: `cursor://anysphere.cursor-deeplink/prompt?${q.toString()}`,
    web: `https://cursor.com/link/prompt?${q.toString()}`,
  };
}

/** Claude pre-fills the composer (user still sends the message). */
export function buildClaudeNewChatLink(text: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(text)}`;
}
