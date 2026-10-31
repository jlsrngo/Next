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
 * Multi-color language palette progression matching Top Languages repo bars:
 * Cyan (TypeScript), Coral (HTML), Sage (Python), Violet (CSS), Yellow (JavaScript), Pink (C++)
 */
export const MULTI_COLOR_HEATMAP_FAMILIES = [
  // TypeScript (Cyan)
  { name: 'TypeScript', colors: ['#DAF5F0', '#A7DBD8', '#87CEEB', '#69D2E7'] },
  // HTML (Coral / Salmon)
  { name: 'HTML', colors: ['#F8D6B3', '#FFA07A', '#FF7A5C', '#FF6B6B'] },
  // Python (Sage / Green)
  { name: 'Python', colors: ['#B5D2AD', '#BAFCA2', '#90EE90', '#7FBC8C'] },
  // CSS (Violet / Purple)
  { name: 'CSS', colors: ['#E3DFF2', '#C4A1FF', '#A388EE', '#9723C9'] },
  // JavaScript (Canary Yellow)
  { name: 'JavaScript', colors: ['#FDFD96', '#FFDB58', '#F4D738', '#E3A018'] },
  // C++ (Pink)
  { name: 'C++', colors: ['#FCDFFF', '#FFC0CB', '#FFB2EF', '#FF69B4'] },
];

export const HEATMAP_LEGEND_LEVELS = [
  undefined,
  '#A7DBD8', // Cyan (TypeScript)
  '#FFDB58', // Yellow (JavaScript)
  '#FFA07A', // Coral (HTML)
  '#A388EE', // Violet (CSS)
];

export function getHeatmapCellColor(dateStr: string, level: number): string | undefined {
  if (level <= 0) return undefined;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) & 0xffffffff;
  }
  const family = MULTI_COLOR_HEATMAP_FAMILIES[Math.abs(hash) % MULTI_COLOR_HEATMAP_FAMILIES.length];
  const levelIdx = Math.min(Math.max(level - 1, 0), 3);
  return family.colors[levelIdx];
}

export const HEATMAP_PALETTE = {
  emptyLight: '#e9e8e4',
  emptyDark: '#1b1c21',
  level1: '#A7DBD8',
  level2: '#FFDB58',
  level3: '#FFA07A',
  level4: '#69D2E7',
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
