/// <reference types="chrome"/>

import { injectAndObserve } from "./modules/mutation-observer";
import type { ContentScriptMessage, UserConfigInterface } from "./utils/types";

// UNIVERSAL VARIABLE FOR USER CONFIG
export let USER_CONFIG: UserConfigInterface | null = null;

// Listen for messages from the background script
// Listening for message when user initially setup or updates its config details
chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
  try {
    if (
      message.type === "INIT_USER_CONFIG" ||
      message.type === "USER_CONFIG_UPDATED"
    ) {
      console.log(`Received message of type: ${message.type}`);
      USER_CONFIG = message.payload;
      injectAndObserve();
    } else {
      console.warn(`Unknown message type received: ${message.type}`);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
});

// Notify the background script that this content script is live
chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_LOADED" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error(
      "Failed to notify background script:",
      chrome.runtime.lastError
    );
  } else {
    console.log("Background script notified successfully:", response);
  }
});
