/// <reference types="chrome"/>

// Constants for keys and message types
const CONFIG_KEY = "user_config";
const MESSAGE_TYPES = {
  CONTENT_SCRIPT_LOADED: "CONTENT_SCRIPT_LOADED",
  INIT_USER_CONFIG: "INIT_USER_CONFIG",
  USER_CONFIG_UPDATED: "USER_CONFIG_UPDATED",
};

// Configuration for retry logic
const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
};

console.log("Articulate background script initializing...");

// Handle extension installation/upgrade
chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    console.log("Extension installed/updated:", details);

    if (details.reason === "install") {
      console.log("Fresh install detected, attempting to open popup...");
      openExtensionPopup()
        .then(() => console.log("Popup opened successfully"))
        .catch((err) => console.error("Failed to open popup on install:", err));
    }
  }
);

// Handle messages from content scripts and other parts
chrome.runtime.onMessage.addListener(
  (message: any, sender: chrome.runtime.MessageSender) => {
    console.log("Received message:", message.type, "from sender:", sender);
    try {
      switch (message.type) {
        case MESSAGE_TYPES.CONTENT_SCRIPT_LOADED:
          handleContentScriptLoaded(sender);
          break;
        default:
          console.warn("Received unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }

    // Return false to indicate we don't want to send an async response
    return false;
  }
);

// Handle changes to chrome.storage
chrome.storage.onChanged.addListener(
  async (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: string
  ) => {
    if (area !== "local" || !changes[CONFIG_KEY]) {
      return;
    }

    console.log("Detected configuration change in storage");
    const newConfig = changes[CONFIG_KEY].newValue;

    if (!newConfig) {
      console.warn("Empty configuration received in storage change");
      return;
    }

    try {
      await broadcastConfigUpdate(newConfig);
      console.log("Successfully broadcasted configuration update to all tabs");
    } catch (error) {
      console.error("Failed to broadcast configuration update:", error);
    }
  }
);

// ##################################################################################
// HELPER FUNCTIONS
// ##################################################################################

// Handles the "content script loaded" message from content scripts
async function handleContentScriptLoaded(sender: chrome.runtime.MessageSender) {
  console.log("Content script loaded from tab:", sender.tab?.id);

  try {
    const config = await getStoredConfig();
    if (config) {
      // Configuration exists - send it to the requesting tab
      if (sender.tab?.id) {
        await sendMessageToTab(sender.tab.id, {
          type: MESSAGE_TYPES.INIT_USER_CONFIG,
          payload: config,
        });
        console.log("Sent initial config to tab:", sender.tab.id);
      }
    } else {
      // No configuration exists - open popup to set it up
      console.log("No configuration found, opening popup for setup...");
      await openExtensionPopup();
    }
  } catch (error) {
    console.error("Error handling content script load:", error);
  }
}

// Retrieves the stored user configuration
function getStoredConfig(): Promise<any | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(CONFIG_KEY, (items) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error retrieving stored config:",
          chrome.runtime.lastError
        );
        resolve(null);
        return;
      }
      resolve(items[CONFIG_KEY] || null);
    });
  });
}

// Opens the extension popup programmatically
function openExtensionPopup(): Promise<void> {
  return chrome.action.openPopup().catch((err) => {
    console.error("Failed to open popup:", err);
    throw err;
  });
}

// Broadcasts a configuration update to all extension tabs
async function broadcastConfigUpdate(newConfig: any) {
  try {
    const tabs = await chrome.tabs.query({});
    console.log(`Broadcasting configuration update to ${tabs.length} tabs`);

    await Promise.all(
      tabs.map(async (tab) => {
        if (tab.id) {
          try {
            await sendMessageToTab(tab.id, {
              type: MESSAGE_TYPES.USER_CONFIG_UPDATED,
              payload: newConfig,
            });
          } catch (error) {
            console.warn(`Failed to update tab ${tab.id}:`, error);
            // Continue with other tabs even if one fails
          }
        }
      })
    );
  } catch (error) {
    console.error("Error broadcasting to tabs:", error);
    throw error;
  }
}

// Sends a message to a specific tab with retry logic
async function sendMessageToTab(
  tabId: number,
  message: any,
  retriesLeft: number = RETRY_CONFIG.MAX_RETRIES
): Promise<void> {
  try {
    await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          console.debug(`Message sent to tab ${tabId}, response:`, response);
          resolve(response);
        }
      });
    });
  } catch (error) {
    if (retriesLeft > 0) {
      console.log(
        `Retrying message to tab ${tabId}... (${retriesLeft} attempts left)`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY_MS)
      );
      await sendMessageToTab(tabId, message, retriesLeft - 1);
    } else {
      console.error(
        `Failed to send message to tab ${tabId} after retries:`,
        error
      );
      throw error;
    }
  }
}
