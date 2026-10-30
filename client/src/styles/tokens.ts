/**
 * MehnatNama (मेहनतनामा) — Design System Tokens
 * Strict adherence to Part B specifications:
 * Primary Forest Green: #176B45
 * Dark Green: #104B32
 * Soft Green: #E8F3EC
 * Background: #F7F8F5
 * Cards: #FFFFFF
 * Primary Text: #202923
 * Secondary Text: #68736B
 * Border: #E5EAE5
 * Success: #15803D
 * Warning: #D97706
 * Danger: #DC2626
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: '#176B45',         // Primary Forest Green
    primaryDark: '#104B32',     // Dark Green
    primarySoft: '#E8F3EC',     // Soft Green
    background: '#F7F8F5',      // App Background
    card: '#FFFFFF',            // Surface Card
    textPrimary: '#202923',     // Primary Text
    textSecondary: '#68736B',   // Secondary Text
    border: '#E5EAE5',          // Soft Border
    success: '#15803D',         // Success Green
    warning: '#D97706',         // Warning Amber
    danger: '#DC2626',          // Danger Red
    
    // Status background tints
    successSoft: '#DCFCE7',
    warningSoft: '#FEF3C7',
    dangerSoft: '#FEE2E2',
    infoSoft: '#E0F2FE',
    info: '#0284C7',
  },
  typography: {
    fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontDevanagari: '"Noto Sans Devanagari", Inter, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  identity: {
    name: 'MehnatNama',
    nameHindi: 'मेहनतनामा',
    tagline: 'Har din ka kaam. Har rupaye ka hisaab.',
    taglineHindi: 'हर दिन का काम। हर रुपये का हिसाब।',
    description: 'A worker-first digital wage diary and wage-rights awareness platform for daily-wage and informal workers in India.',
  },
  shadows: {
    subtle: '0 1px 2px 0 rgba(32, 41, 35, 0.04)',
    card: '0 1px 3px 0 rgba(32, 41, 35, 0.05), 0 1px 2px -1px rgba(32, 41, 35, 0.03)',
    lifted: '0 4px 6px -1px rgba(32, 41, 35, 0.06), 0 2px 4px -2px rgba(32, 41, 35, 0.04)',
    dropdown: '0 10px 15px -3px rgba(32, 41, 35, 0.08), 0 4px 6px -4px rgba(32, 41, 35, 0.03)',
  },
  radius: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    full: '9999px',
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
