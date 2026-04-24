// TaskFlow Design System v2
const theme = {
  colors: {
    // Brand
    primary:        "#7C3AED",   // violet-600
    primaryLight:   "#8B5CF6",   // violet-500
    primaryDark:    "#6D28D9",   // violet-700
    primaryGlow:    "#7C3AED33", // violet glow overlay

    // Accent
    accent:         "#06B6D4",   // cyan-500
    accentGlow:     "#06B6D422",

    // Backgrounds
    background:     "#07080F",   // near-black
    surface:        "#0F1117",   // card bg
    surfaceRaised:  "#161925",   // elevated card
    surfaceLight:   "#1E2232",   // input bg

    // Borders
    border:         "#252A3A",
    borderLight:    "#2E3450",

    // Text
    text:           "#EEF2FF",   // almost white with slight blue tint
    textMuted:      "#C4C9E2",
    subtext:        "#7477A0",

    // Semantic
    error:          "#F43F5E",
    errorGlow:      "#F43F5E22",
    success:        "#10B981",
    successGlow:    "#10B98122",
    warning:        "#F59E0B",

    // Status
    status: {
      pending:      "#F59E0B",
      "in-progress":"#3B82F6",
      completed:    "#10B981",
    },
    statusBg: {
      pending:      "#F59E0B18",
      "in-progress":"#3B82F618",
      completed:    "#10B98118",
    },

    // Priority
    priority: {
      low:    "#34D399",
      medium: "#FBBF24",
      high:   "#F87171",
    },
    priorityBg: {
      low:    "#34D39918",  
      medium: "#FBBF2418",
      high:   "#F8717118",
    },
  },

  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },

  borderRadius: {
    xs:  6,
    sm:  10,
    md:  14,
    lg:  20,
    xl:  28,
    full: 999,
  },

  fontSize: {
    xs:  11,
    sm:  13,
    md:  15,
    lg:  17,
    xl:  21,
    xxl: 28,
    xxxl: 36,
  },

  fontWeight: {
    normal:   "400",
    medium:   "500",
    semibold: "600",
    bold:     "700",
    extrabold:"800",
  },

  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: "#7C3AED",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
  },
};

export default theme;
