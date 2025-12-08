import type { MarkupMatrix } from "~~/db/schema";

// Composable to fetch markup matrix
export const useMarkupMatrix = () => {
  return useFetch<MarkupMatrix[]>('/api/markup');
};

// Calculate markup with linear interpolation for smooth transitions
export const calculateMarkup = (unitCost: number, matrix: MarkupMatrix[]): number => {
  if (!matrix || matrix.length === 0) return 1;
  if (unitCost <= 0) return matrix[0]?.multiplier ?? 1;

  // Sort matrix by value to ensure correct ordering
  const sorted = [...matrix].sort((a, b) => a.value - b.value);
  
  // Find the appropriate range for interpolation
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    
    // If cost is less than the first threshold, use first multiplier
    if (i === 0 && unitCost < current.value) {
      return current.multiplier;
    }
    
    // If cost falls within this range, interpolate
    if (unitCost < current.value) {
      const prev = sorted[i - 1];
      
      // Linear interpolation between prev and current
      const rangeStart = prev.value;
      const rangeEnd = current.value;
      const markupStart = prev.multiplier;
      const markupEnd = current.multiplier;
      
      const position = (unitCost - rangeStart) / (rangeEnd - rangeStart);
      return markupStart + (markupEnd - markupStart) * position;
    }
  }
  
  // If cost is beyond all thresholds, use the last multiplier
  return sorted[sorted.length - 1]?.multiplier ?? 1;
};
