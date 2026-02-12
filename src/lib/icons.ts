/**
 * Convert kebab-case to PascalCase (e.g., "book-open" -> "BookOpen")
 * Shared utility for icon name conversion
 */
export function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
