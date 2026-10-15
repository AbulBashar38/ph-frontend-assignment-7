// Page searchParams as Next.js passes them (a value can repeat, so it may be an array)
export type RawSearchParams = Record<string, string | string[] | undefined>;

// Keep only the allowed, non-empty keys (first value wins), so the API never sees unexpected params
export function pickSearchParams<K extends string>(
  raw: RawSearchParams,
  allowed: readonly K[],
): Partial<Record<K, string>> {
  const picked: Partial<Record<K, string>> = {};
  for (const key of allowed) {
    const value = raw[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (first?.trim()) picked[key] = first.trim();
  }
  return picked;
}

// A positive whole number from a query string, or the fallback
export function toPositiveInt(value: string | undefined, fallback: number) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}
