export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function getUniqueValues<T>(arr: T[]): T[] {
  const set = new Set(arr)
  return Array.from(set)
}