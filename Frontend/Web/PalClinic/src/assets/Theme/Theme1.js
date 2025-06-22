// theme.ts

export const Theme = {
  // 🎨 Color Palette

  // Primary branding color (used for buttons, headers, icons)
  primary: '#007BFF', // Medical blue

  // Lighter variant for backgrounds and cards
  primaryLight: '#E6F0FA', // Light blue for cards, hover states

  // Accent color for actions (e.g. floating button, highlights)
  accent: '#00C9A7', // Calming mint green

  // Backgrounds
  background: '#FFFFFF', // Main app background
  cardBackground: '#F0F8FF', // For appointment cards and surfaces
  navBarBackground: '#F9F9F9', // For bottom navigation/tab bar

  // Text colors
  textPrimary: '#1C1C1C', // Titles, main labels
  textSecondary: '#666666', // Subtext, captions, less important text
  textInverse: '#FFFFFF', // On colored buttons or dark areas

  // Status colors
  success: '#5CB85C', // Success messages, confirmed appointments
  warning: '#FFC107', // For things like pending status
  danger: '#D9534F', // Errors, cancellations

  // Borders and shadows
  border: '#E0E0E0', // Input borders, dividers
  shadow: 'rgba(0, 0, 0, 0.1)', // Card and modal shadow

  // Disabled state
  disabled: '#CCCCCC', // For disabled buttons or inputs

  // Optional highlights
  highlight: '#D0F0E9', // Background for selected or hovered items

  // 🔤 Font Sizes
  fontSize: {
    title: 20,       // Page titles
    heading: 18,     // Section headers
    normal: 16,      // Regular text
    small: 14,       // Captions, helper text
    tiny: 12,        // Very small notes
  },

  // 📐 Spacing (used for margin/padding)
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    xLarge: 32,
  },

  // 🔲 Border radius for consistent rounded corners
  borderRadius: {
    small: 6,
    medium: 12,
    large: 20,
  },

  // 🆎 Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    bold: '700',
  }
};
