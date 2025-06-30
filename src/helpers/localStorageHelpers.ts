/**
 * Save data to localStorage under a specific key
 * @param key - string key to store under
 * @param value - any serializable data
 */
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err);
  }
}

/**
 * Retrieve data from localStorage
 * @param key - string key to fetch from
 * @returns parsed data or null if not found or invalid
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Failed to parse localStorage key "${key}"`, err);
    return null;
  }
}

/**
 * Remove a specific key from localStorage
 * @param key - string key to remove
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove localStorage key "${key}"`, err);
  }
}
