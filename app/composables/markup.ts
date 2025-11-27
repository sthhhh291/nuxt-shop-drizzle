// Markup matrix with smooth interpolation between ranges
export const markupMatrix = [
  { costLimit: 5, markup: 3 },
  { costLimit: 10, markup: 2.75 },
  { costLimit: 25, markup: 2 },
  { costLimit: 100, markup: 1.86 },
  { costLimit: 200, markup: 1.52 },
  { costLimit: 250, markup: 1.43 },
  { costLimit: 500, markup: 1.34 },
  { costLimit: 1000, markup: 1.26 },
  { costLimit: Infinity, markup: 1.21 },
];

// Calculate markup with linear interpolation for smooth transitions
export const calculateMarkup = (unitCost: number): number => {
  if (unitCost <= 0) return markupMatrix[0].markup;

  // Find the range we're in
  for (let i = 0; i < markupMatrix.length - 1; i++) {
    const current = markupMatrix[i];
    const next = markupMatrix[i + 1];
    
    if (unitCost < current.costLimit) {
      // We're in this range - interpolate if not the first range
      if (i === 0) {
        return current.markup;
      }
      
      const prev = markupMatrix[i - 1];
      const rangeStart = prev.costLimit;
      const rangeEnd = current.costLimit;
      const markupStart = prev.markup;
      const markupEnd = current.markup;
      
      // Linear interpolation
      const position = (unitCost - rangeStart) / (rangeEnd - rangeStart);
      return markupStart + (markupEnd - markupStart) * position;
    }
  }
  
  // If we're beyond the last finite limit, use the final markup
  return markupMatrix[markupMatrix.length - 1].markup;
};