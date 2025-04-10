// utils/localStorage.ts
export const safeLocalStorage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    }
    return fallback;
  },

  set<T>(key: string, value: T) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  remove(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};
