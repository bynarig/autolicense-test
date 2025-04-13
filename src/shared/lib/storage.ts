// lib/storage.ts
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Add this to your lib/storage.ts for better typing
export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<string>;
  removeItem(key: string): Promise<void>;
}

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: never) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;