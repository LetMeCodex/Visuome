/**
 * Placeholder registry container for responsive breakpoint layouts.
 * Contains no logical calculations.
 */
export class ResponsiveRegistry {
  constructor(data = {}) {
    this.breakpoints = data.breakpoints || [];
    this.layouts = data.layouts || [];
    this.viewportVariants = data.viewportVariants || [];
  }
}
