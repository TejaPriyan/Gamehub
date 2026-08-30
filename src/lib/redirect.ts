/**
 * Recovers a deep link that was captured by the static-host 404 fallback
 * (see `public/404.html`) and returns the route the client router should
 * navigate to. Returns `null` when there is nothing to restore.
 */
export function consumeDeepLinkRedirect(): string | null {
  try {
    const target = sessionStorage.getItem("gh-pages-redirect");
    if (!target) return null;
    sessionStorage.removeItem("gh-pages-redirect");
    return target;
  } catch {
    return null;
  }
}
