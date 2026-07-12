import { GenomeAnalyzerInterface } from "./GenomeAnalyzerInterface.js";

/**
 * Normalizes Spacing, Typography, Radius, Elevation, Grid scales, container widths, colors and families.
 */
export class DesignSystemDNAExtractor extends GenomeAnalyzerInterface {
  async extract(scanResult) {
    const platform = scanResult.platformRegistry || {};
    const ds = platform.designSystemRegistry || {};
    return {
      spacingScale: ds.spacingScale || [],
      typographyScale: ds.typographyScale || [],
      radiusScale: ds.radiusScale || [],
      elevationScale: ds.elevationScale || [],
      gridScale: ds.gridScale || [],
      containerWidths: ds.containerWidths || [],
      motionScale: ds.motionSystem || {},
      colorTokens: ds.colorSystem || {},
      componentFamilies: ds.componentFamilies || []
    };
  }

  name() {
    return "DesignSystemDNAExtractor";
  }

  version() {
    return "1.0.0";
  }

  dependencies() {
    return ["platformRegistry"];
  }
}
