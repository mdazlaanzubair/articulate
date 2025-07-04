/**
 * Get a value from Chrome local storage.
 * @param key - The key to retrieve.
 * @returns A promise that resolves with the stored value or null if not found.
 */
export async function getStoredData<T = any>(key: string): Promise<T | null> {
    try {
      return await new Promise<T | null>((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(`Failed to get key "${key}": ${chrome.runtime.lastError.message}`));
            return;
          }
          resolve(result[key] ?? null); // Return null if key not found
        });
      });
    } catch (error) {
      console.error("getStoredData error:", error);
      return null;
    }
  }
  
  /**
   * Set a value in Chrome local storage.
   * @param key - The key to set.
   * @param data - The data to store.
   * @returns A promise that resolves when the data is stored.
   */
  export async function setStoredData<T = any>(key: string, data: T): Promise<boolean> {
    try {
      return await new Promise<boolean>((resolve, reject) => {
        chrome.storage.local.set({ [key]: data }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(`Failed to set key "${key}": ${chrome.runtime.lastError.message}`));
            return;
          }
          resolve(true);
        });
      });
    } catch (error) {
      console.error("setStoredData error:", error);
      return false;
    }
  }
  