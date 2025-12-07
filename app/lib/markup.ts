import type { MarkupMatrix } from "~/db/schema";

// Cache for markup matrix to avoid repeated API calls
let markupCache: MarkupMatrix[] | null = null;

// Fetch markup matrix from API
async function getMarkupMatrix(): Promise<MarkupMatrix[]> {
  if (markupCache) {
    return markupCache;
  }

  const { data } = await $fetch<MarkupMatrix[]>("/api/markup");
  markupCache = data.sort((a, b) => a.value - b.value); // Sort by value ascending
  return markupCache;
}

// Apply markup with linear interpolation
export async function applyMarkup(price: number): Promise<number> {
  if (price <= 0) return 0;

  const markupMatrix = await getMarkupMatrix();

  if (!markupMatrix || markupMatrix.length === 0) {
    return price; // Return original price if no markup data
  }

  // If price is below the first threshold, use the first multiplier
  if (price <= markupMatrix[0].value) {
    return price * markupMatrix[0].multiplier;
  }

  // If price is above the last threshold, use the last multiplier
  const lastIndex = markupMatrix.length - 1;
  if (price >= markupMatrix[lastIndex].value) {
    return price * markupMatrix[lastIndex].multiplier;
  }

  // Find the two points to interpolate between
  for (let i = 0; i < markupMatrix.length - 1; i++) {
    const lower = markupMatrix[i];
    const upper = markupMatrix[i + 1];

    if (price >= lower.value && price <= upper.value) {
      // Linear interpolation
      const priceRatio = (price - lower.value) / (upper.value - lower.value);
      const interpolatedMultiplier =
        lower.multiplier + (upper.multiplier - lower.multiplier) * priceRatio;

      return price * interpolatedMultiplier;
    }
  }

  // Fallback (shouldn't reach here)
  return price * markupMatrix[0].multiplier;
}

// Synchronous version when you already have the markup matrix
export function applyMarkupSync(
  price: number,
  markupMatrix: MarkupMatrix[]
): number {
  if (price <= 0) return 0;

  if (!markupMatrix || markupMatrix.length === 0) {
    return price; // Return original price if no markup data
  }

  // Sort by value ascending (in case it's not sorted)
  const sortedMatrix = [...markupMatrix].sort((a, b) => a.value - b.value);

  // If price is below the first threshold, use the first multiplier
  if (price <= sortedMatrix[0].value) {
    return price * sortedMatrix[0].multiplier;
  }

  // If price is above the last threshold, use the last multiplier
  const lastIndex = sortedMatrix.length - 1;
  if (price >= sortedMatrix[lastIndex].value) {
    return price * sortedMatrix[lastIndex].multiplier;
  }

  // Find the two points to interpolate between
  for (let i = 0; i < sortedMatrix.length - 1; i++) {
    const lower = sortedMatrix[i];
    const upper = sortedMatrix[i + 1];

    if (price >= lower.value && price <= upper.value) {
      // Linear interpolation
      const priceRatio = (price - lower.value) / (upper.value - lower.value);
      const interpolatedMultiplier =
        lower.multiplier + (upper.multiplier - lower.multiplier) * priceRatio;

      return price * interpolatedMultiplier;
    }
  }

  // Fallback (shouldn't reach here)
  return price * sortedMatrix[0].multiplier;
}

// Get markup multiplier only (without applying to price)
export function getMarkupMultiplier(
  price: number,
  markupMatrix: MarkupMatrix[]
): number {
  if (price <= 0) return 1;

  if (!markupMatrix || markupMatrix.length === 0) {
    return 1; // No markup
  }

  // Sort by value ascending (in case it's not sorted)
  const sortedMatrix = [...markupMatrix].sort((a, b) => a.value - b.value);

  // If price is below the first threshold, use the first multiplier
  if (price <= sortedMatrix[0].value) {
    return sortedMatrix[0].multiplier;
  }

  // If price is above the last threshold, use the last multiplier
  const lastIndex = sortedMatrix.length - 1;
  if (price >= sortedMatrix[lastIndex].value) {
    return sortedMatrix[lastIndex].multiplier;
  }

  // Find the two points to interpolate between
  for (let i = 0; i < sortedMatrix.length - 1; i++) {
    const lower = sortedMatrix[i];
    const upper = sortedMatrix[i + 1];

    if (price >= lower.value && price <= upper.value) {
      // Linear interpolation
      const priceRatio = (price - lower.value) / (upper.value - lower.value);
      return (
        lower.multiplier + (upper.multiplier - lower.multiplier) * priceRatio
      );
    }
  }

  // Fallback (shouldn't reach here)
  return sortedMatrix[0].multiplier;
}

// Clear the cache (useful for testing or when markup matrix changes)
export function clearMarkupCache(): void {
  markupCache = null;
}
