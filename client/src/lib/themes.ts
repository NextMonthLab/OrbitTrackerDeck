export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
  font: string;
  fontDisplay: string;
  texture?: string;
  effects: {
    glow: string;
    shadow: string;
    border: string;
    hover: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  military: {
    id: "military",
    name: "Military",
    description: "Tactical command interface with stencil fonts and olive color palette",
    background: "#1A1D1A",
    surface: "#2A2F2A", 
    primary: "#556B2F",
    secondary: "#8B7D3A",
    accent: "#D4AF37",
    text: "#E5E5E5",
    textMuted: "#9CA3AF",
    font: "JetBrains Mono",
    fontDisplay: "Orbitron",
    texture: "/assets/themes/military/grid.svg",
    effects: {
      glow: "0 0 20px rgba(212, 175, 55, 0.3)",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
      border: "#556B2F",
      hover: "rgba(212, 175, 55, 0.1)"
    }
  },
  ultraModern: {
    id: "ultraModern", 
    name: "Ultra-Modern",
    description: "Minimalist design with clean lines and monochromatic palette",
    background: "#0A0A0A",
    surface: "#1A1A1A",
    primary: "#FFFFFF",
    secondary: "#E5E5E5",
    accent: "#00FFFF",
    text: "#FFFFFF",
    textMuted: "#A1A1AA",
    font: "Inter",
    fontDisplay: "Inter",
    texture: "/assets/themes/modern/noise.png",
    effects: {
      glow: "0 0 25px rgba(0, 255, 255, 0.4)",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
      border: "#FFFFFF",
      hover: "rgba(255, 255, 255, 0.05)"
    }
  },
  technology: {
    id: "technology",
    name: "Technology", 
    description: "Cyberpunk-inspired theme with neon accents and digital aesthetics",
    background: "#000000",
    surface: "#0F0F0F",
    primary: "#00FFEF",
    secondary: "#00D4AA",
    accent: "#1E90FF",
    text: "#00FFEF",
    textMuted: "#64748B",
    font: "JetBrains Mono",
    fontDisplay: "Orbitron",
    texture: "/assets/themes/tech/grid.svg",
    effects: {
      glow: "0 0 30px rgba(0, 255, 239, 0.5)",
      shadow: "0 4px 20px rgba(30, 144, 255, 0.3)",
      border: "#00FFEF",
      hover: "rgba(0, 255, 239, 0.1)"
    }
  }
};

export const defaultTheme = themes.military;

export type ThemeId = keyof typeof themes;