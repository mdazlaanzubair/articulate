// Retrieves a value from Chrome's local storage.
export async function getStoredData<T = any>(key: string): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          `Failed to get key "${key}":`,
          chrome.runtime.lastError.message
        );
        resolve(null);
        return;
      }
      console.log(`Retrieved data for key "${key}":`, result[key]);
      resolve(result[key] ?? null);
    });
  }).catch((error) => {
    console.error("Error in getStoredData:", error);
    return null;
  });
}

// Sets a value in Chrome's local storage.
export async function setStoredData<T = any>(
  key: string,
  data: T
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    chrome.storage.local.set({ [key]: data }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          `Failed to set key "${key}":`,
          chrome.runtime.lastError.message
        );
        resolve(false);
        return;
      }
      console.log(`Successfully set data for key "${key}":`, data);
      resolve(true);
    });
  }).catch((error) => {
    console.error("Error in setStoredData:", error);
    return false;
  });
}
