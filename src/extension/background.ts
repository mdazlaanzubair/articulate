/// <reference types="chrome"/>

const CONFIG_KEY = "user_config";

// Fired once when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  // Only open the popup on a fresh install, not on updates
  // if (details.reason === "install") {
  console.log("Extension Details:", details);
  // Programmatically open the popup associated with this action
  chrome.action.openPopup().catch((err) => {
    // openPopup can only be called in MV3+ and Chrome 95+, so catch any errors
    console.error("Failed to open popup on install:", err);
  });
  // }
});

// Listen for the content script’s “I’m up!” ping
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "CONTENT_SCRIPT_LOADED") {
    // 1. Read out user_config from storage
    chrome.storage.local.get(CONFIG_KEY, (items) => {
      const config = items.user_config;
      if (config !== undefined) {
        // 2a. If it exists, send it back to that tab only
        if (sender.tab?.id) {
          chrome.tabs.sendMessage(
            sender.tab.id,
            { type: "INIT_USER_CONFIG", payload: config },
            () => {
              if (chrome.runtime.lastError) {
                console.warn(
                  "Failed to send INIT_USER_CONFIG:",
                  chrome.runtime.lastError
                );
              }
            }
          );
        }
      } else {
        // 2b. If it doesn’t exist, open the popup
        chrome.action.openPopup().catch((err) => {
          console.error("Failed to open popup:", err);
        });
      }
    });

    // Return true if you want to send an asynchronous response (not needed here)
    return false;
  }
});

// Listen for any changes in chrome.storage
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.user_config) {
    // user_config was added/updated/removed
    console.log("user_config changed:", changes.user_config);

    // Broadcast a message to all tabs
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(
            tab.id,
            {
              type: "USER_CONFIG_UPDATED",
              updatedPayload: changes.user_config,
            },
            (response) => {
              // Optional: handle response or errors
              console.log("RESPONSE OF STORAGE CHANGE:", response);

              if (chrome.runtime.lastError) {
                console.warn(
                  `Could not send message to tab ${tab.id}:`,
                  chrome.runtime.lastError
                );
              }
            }
          );
        }
      }
    });
  }
});
