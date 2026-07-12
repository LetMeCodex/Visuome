/**
 * PresetRegistry contains available configurations for prompt structures.
 */
export class PresetRegistry {
  constructor() {
    this.presets = {
      Clone: {
        layout: true,
        motion: true,
        components: true,
        typography: true,
        branding: false,
        companyName: false,
        responsive: true,
        designSystem: true
      },
      Minimal: {
        layout: true,
        motion: false,
        components: false,
        typography: true,
        branding: false,
        companyName: false,
        responsive: false,
        designSystem: true
      },
      Production: {
        layout: true,
        motion: true,
        components: true,
        typography: true,
        branding: true,
        companyName: true,
        responsive: true,
        designSystem: true
      },
      Developer: {
        layout: true,
        motion: true,
        components: true,
        typography: true,
        branding: false,
        companyName: false,
        responsive: true,
        designSystem: true
      },
      Educational: {
        layout: true,
        motion: true,
        components: true,
        typography: true,
        branding: true,
        companyName: true,
        responsive: true,
        designSystem: true
      }
    };
  }
}
