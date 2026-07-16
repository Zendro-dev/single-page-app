export const localStorage = {
  setItem: (key: string, data: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, data);
    }
  },

  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  },

  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  },
};
