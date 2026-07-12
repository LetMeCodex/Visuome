import ColorTokens from "./ColorTokens.js";
import SpacingTokens from "./SpacingTokens.js";
import TypographyTokens from "./TypographyTokens.js";
import RadiusTokens from "./RadiusTokens.js";
import ElevationTokens from "./ElevationTokens.js";
import MotionTokens from "./MotionTokens.js";

/**
 * Aggregates all Visuome premium design token subsystems.
 */
export const DesignTokens = {
  colors: ColorTokens,
  spacing: SpacingTokens,
  typography: TypographyTokens,
  radius: RadiusTokens,
  elevation: ElevationTokens,
  motion: MotionTokens
};
export default DesignTokens;
