// Strips Unicode combining diacritical marks left behind after NFKD
// normalization splits an accented character into base letter + accent.
const COMBINING_DIACRITICAL_MARKS = /[\u0300-\u036f]/g;

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICAL_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const baseSlug = slugify(base);
  let candidate = baseSlug;
  let suffix = 2;

  while (await exists(candidate)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
