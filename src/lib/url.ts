export const toAbsoluteUrl = (
  href: string,
  base = import.meta.url,
): string => {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}
