/// <reference types="chrome"/>

import { injectAndObserve } from "../utils/helpers/selectorAPI";
import type { UserConfigInterface } from "../utils/types";

// UNIVERSAL VARIABLE FOR USER CONFIG
export let USER_CONFIG: UserConfigInterface | null = null;

// Fires when is there any change in user_config
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "USER_CONFIG_UPDATED") {
    // message.updatedPayload is only sent when changes it's user_config settings
    console.log("Received updated config:", message.updatedPayload);
    USER_CONFIG = message.updatedPayload;
    injectAndObserve();
  }
});

// Notify background that this content script is live
chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_LOADED" });

// Listen for a response carrying the existing config
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "INIT_USER_CONFIG") {
    // message.payload is only sent when user_config exists
    USER_CONFIG = message.payload;
    console.log("Initial user_config:", message.payload);
    injectAndObserve();
  }
});
