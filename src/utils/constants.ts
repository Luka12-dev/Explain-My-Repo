export const APP_NAME = 'Explain My Repo';
export const APP_VERSION = '2.0.0';
export const APP_AUTHOR = 'Luka';

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  MODELS: '/api/models',
  MODEL_DOWNLOAD: '/api/models/download',
  REPOSITORY_INFO: '/api/repository/info',
  ANALYZE: '/api/analyze',
  SEARCH: '/api/search',
};

export const GITHUB_LINKS = {
  PROFILE: 'https://github.com/Luka12-dev/',
  REPOSITORY: 'https://github.com/Luka12-dev/Explain-My-Repo',
  YOUTUBE: 'https://www.youtube.com/@LukaCyber-s4b7o',
};

export const THEMES = {
  LIQUID_BLUE: 'liquid-blue',
  LIQUID_DARK: 'liquid-dark',
} as const;

export const QUALITY_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  FAIR: 50,
  POOR: 30,
};

export const COMPLEXITY_THRESHOLDS = {
  LOW: 5,
  MODERATE: 10,
  HIGH: 20,
  VERY_HIGH: 30,
};

export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  MAX_TOTAL_SIZE: 100 * 1024 * 1024,
};

export const CACHE_KEYS = {
  THEME: 'theme-storage',
  SETTINGS: 'settings-storage',
  ANALYSIS_HISTORY: 'analysis-history',
  MODELS: 'models-cache',
};

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

export const SUPPORTED_LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'Scala',
  'R',
] as const;

export const CODE_EXTENSIONS = {
  TYPESCRIPT: ['.ts', '.tsx'],
  JAVASCRIPT: ['.js', '.jsx'],
  PYTHON: ['.py'],
  JAVA: ['.java'],
  CPP: ['.cpp', '.cc', '.cxx'],
  C: ['.c', '.h'],
  CSHARP: ['.cs'],
  GO: ['.go'],
  RUST: ['.rs'],
  RUBY: ['.rb'],
  PHP: ['.php'],
};

export const DEFAULT_MODELS = [
  'codellama-7b',
  'codellama-13b',
  'codellama-34b',
  'starcoder-15b',
  'wizardcoder-15b',
  'deepseek-coder-6.7b',
  'phi-2',
  'mistral-7b',
  'llama2-7b',
  'granite-code-8b',
];

export const SECURITY_SEVERITIES = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const ANALYSIS_STAGES = [
  'Initializing',
  'Fetching repository',
  'Analyzing code structure',
  'Scanning dependencies',
  'Running security checks',
  'Calculating metrics',
  'Generating AI insights',
  'Finalizing report',
] as const;
