export class LocalStorageService {
  static get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return defaultValue || null;
    }
  }

  static set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  }

  static remove(key: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
      return false;
    }
  }

  static clear(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  }

  static has(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(key) !== null;
  }

  static keys(): string[] {
    if (typeof window === 'undefined') return [];
    return Object.keys(window.localStorage);
  }

  static size(): number {
    if (typeof window === 'undefined') return 0;
    return window.localStorage.length;
  }
}
