export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function formatLineCount(lines: number): string {
  if (lines < 1000) return lines.toString();
  if (lines < 1000000) return `${(lines / 1000).toFixed(1)}K`;
  return `${(lines / 1000000).toFixed(1)}M`;
}

export function formatScore(score: number, maxScore: number = 100): string {
  return `${score}/${maxScore}`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,
    /^([^\/]+)\/([^\/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
      };
    }
  }

  return null;
}

export function formatCommitHash(hash: string, length: number = 7): string {
  return hash.substring(0, length);
}

export function formatFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    return `.${parts[parts.length - 1]}`;
  }
  return '';
}

export function getFileIcon(filename: string): string {
  const ext = formatFileExtension(filename).toLowerCase();
  const iconMap: Record<string, string> = {
    '.js': '🟨',
    '.ts': '🔷',
    '.jsx': '⚛️',
    '.tsx': '⚛️',
    '.py': '🐍',
    '.java': '☕',
    '.cpp': '➕',
    '.c': '©️',
    '.cs': '#️⃣',
    '.go': '🔵',
    '.rs': '🦀',
    '.rb': '💎',
    '.php': '🐘',
    '.html': '🌐',
    '.css': '🎨',
    '.json': '📋',
    '.md': '📝',
    '.yml': '⚙️',
    '.yaml': '⚙️',
  };

  return iconMap[ext] || '📄';
}

export function formatApiUrl(baseUrl: string, endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function formatCodeSnippet(code: string, maxLines: number = 5): string {
  const lines = code.split('\n');
  if (lines.length <= maxLines) return code;
  return lines.slice(0, maxLines).join('\n') + '\n...';
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function formatSeverity(severity: string): string {
  const severityMap: Record<string, string> = {
    low: 'Low',
    moderate: 'Moderate',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };

  return severityMap[severity.toLowerCase()] || severity;
}

export function getSeverityColor(severity: string): string {
  const colorMap: Record<string, string> = {
    low: 'blue',
    moderate: 'yellow',
    medium: 'yellow',
    high: 'orange',
    critical: 'red',
  };

  return colorMap[severity.toLowerCase()] || 'gray';
}

export function formatLanguageName(language: string): string {
  const languageMap: Record<string, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    jsx: 'JavaScript React',
    tsx: 'TypeScript React',
    py: 'Python',
    rb: 'Ruby',
    cpp: 'C++',
    cs: 'C#',
  };

  return languageMap[language.toLowerCase()] || language;
}

export function sortByKey<T>(array: T[], key: keyof T, ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function mergeDeep<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source) {
    Object.keys(source).forEach((key) => {
      const targetValue = (target as any)[key];
      const sourceValue = (source as any)[key];

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
        if (!targetValue || typeof targetValue !== 'object') {
          (target as any)[key] = {};
        }
        mergeDeep((target as any)[key], sourceValue);
      } else {
        (target as any)[key] = sourceValue;
      }
    });
  }

  return mergeDeep(target, ...sources);
}

export function arrayUnique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function arrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => arr2.includes(item));
}

export function arrayDifference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => !arr2.includes(item));
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flattenArray<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export function standardDeviation(numbers: number[]): number {
  const avg = average(numbers);
  const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

export function percentile(numbers: number[], p: number): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) {
    return sorted[lower];
  }

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
