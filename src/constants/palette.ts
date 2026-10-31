/**
 * Sepidy Design Color Palette
 * 24 curated pastel and vibrant technical tokens requested by user
 */
export const PALETTE = {
  // Row 1 (soft pastels)
  softCyan: '#DAF5F0',
  softSage: '#B5D2AD',
  softYellow: '#FDFD96',
  softPeach: '#F8D6B3',
  softLavenderPink: '#FCDFFF',
  softPeriwinkle: '#E3DFF2',

  // Row 2 (medium pastels)
  mint: '#A7DBD8',
  lightLime: '#BAFCA2',
  canaryYellow: '#FFDB58',
  lightSalmon: '#FFA07A',
  lightPink: '#FFC0CB',
  lightViolet: '#C4A1FF',

  // Row 3 (vibrant midtones)
  skyBlue: '#87CEEB',
  lightGreen: '#90EE90',
  sunYellow: '#F4D738',
  coralRed: '#FF7A5C',
  carnationPink: '#FFB2EF',
  mediumViolet: '#A388EE',

  // Row 4 (deep accents)
  deepCyan: '#69D2E7',
  forestSage: '#7FBC8C',
  amberOrange: '#E3A018',
  warmRed: '#FF6B6B',
  hotPink: '#FF69B4',
  royalPurple: '#9723C9',
} as const;

/**
 * GitHub Contribution Heatmap progression using green column (Col 2 from palette):
 * Level 0: empty cell
 * Level 1: #B5D2AD (Row 1 Col 2)
 * Level 2: #BAFCA2 (Row 2 Col 2)
 * Level 3: #90EE90 (Row 3 Col 2)
 * Level 4: #7FBC8C (Row 4 Col 2)
 */
export const HEATMAP_PALETTE = {
  emptyLight: '#e9e8e4',
  emptyDark: '#1b1c21',
  level1: '#B5D2AD',
  level2: '#BAFCA2',
  level3: '#90EE90',
  level4: '#7FBC8C',
} as const;

/**
 * Top Languages strictly mapped to the 24-color palette
 */
export const LANGUAGE_PALETTE: Record<string, string> = {
  typescript: '#69D2E7', // Deep Cyan (Row 4 Col 1)
  ts: '#69D2E7',
  javascript: '#FFDB58', // Canary Yellow (Row 2 Col 3)
  js: '#FFDB58',
  html: '#FF7A5C', // Coral Red (Row 3 Col 4)
  css: '#A388EE', // Medium Violet (Row 3 Col 6)
  python: '#7FBC8C', // Forest Sage (Row 4 Col 2)
  py: '#7FBC8C',
  rust: '#E3A018', // Amber Orange (Row 4 Col 3)
  rs: '#E3A018',
  'c++': '#FF69B4', // Hot Pink (Row 4 Col 5)
  cpp: '#FF69B4',
  c: '#FFB2EF', // Carnation Pink (Row 3 Col 5)
  go: '#A7DBD8', // Mint (Row 2 Col 1)
  golang: '#A7DBD8',
  php: '#C4A1FF', // Light Violet (Row 2 Col 6)
  java: '#FFA07A', // Light Salmon (Row 2 Col 4)
  ruby: '#FF6B6B', // Warm Red (Row 4 Col 4)
  shell: '#B5D2AD', // Soft Sage (Row 1 Col 2)
  bash: '#B5D2AD',
  swift: '#FFA07A',
  kotlin: '#A388EE',
  dart: '#87CEEB',
  sql: '#9723C9',
};

export function getLanguageColor(name: string): string {
  const key = name.trim().toLowerCase();
  return LANGUAGE_PALETTE[key] || PALETTE.forestSage;
}
