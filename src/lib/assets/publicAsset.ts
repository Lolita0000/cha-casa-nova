/**
 * Resolves a file from `public/` against Vite's base URL, so the site works
 * both at a domain root and when served from a sub-path or with base './'.
 */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
