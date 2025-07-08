/// <reference types="chrome"/>

import { injectAndObserve } from "./modules/mutation-observer";
import type { ContentScriptMessage, UserConfigInterface } from "./utils/types";

// UNIVERSAL VARIABLE FOR USER CONFIG
export let USER_CONFIG: UserConfigInterface | null = null;

// Flag to prevent duplicate injections
let isInjected = false;

// --- 1. INIT INJECTION FUNCTION ---
const safeInject = () => {
  if (USER_CONFIG && !isInjected) {
    console.log("🔁 [Articulate] Injecting...");
    injectAndObserve();
    isInjected = true;
  }
};

// --- 2. HANDLE MESSAGES FROM BACKGROUND ---
chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
  try {
    if (
      message.type === "INIT_USER_CONFIG" ||
      message.type === "USER_CONFIG_UPDATED"
    ) {
      console.log(`⚙️ Received message of type: ${message.type}`);
      USER_CONFIG = message.payload;
      isInjected = false; // allow reinjection
      safeInject();
    } else if (message.type === "FORCE_REINJECT") {
      console.log("🧨 Force reinjection triggered.");
      isInjected = false;
      safeInject();
    } else {
      console.warn(`⚠️ Unknown message type received: ${message.type}`);
    }
  } catch (error) {
    console.error("❌ Error handling message:", error);
  }
});

// --- 3. NOTIFY BACKGROUND THAT CONTENT SCRIPT IS ACTIVE ---
chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_LOADED" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error(
      "🚫 Failed to notify background script:",
      chrome.runtime.lastError
    );
  } else {
    console.log("✅ Background script notified successfully:", response);
  }
});

// --- 4. RE-INJECT ON TAB BECOMING ACTIVE AGAIN ---
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("👁️ Tab became visible again. Checking injection...");
    isInjected = false;
    safeInject();
  }
});

// --- 5. RE-INJECT ON URL CHANGE (SPA detection) ---
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    console.log("🔄 URL changed (SPA navigation). Reinjecting...");
    lastUrl = location.href;
    isInjected = false;
    safeInject();
  }
}, 1000); // adjust timing as needed

// --- 6. RE-INJECT ON DOM READY JUST IN CASE ---
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(() => {
    safeInject();
  }, 300); // delay to let LinkedIn load DOM
} else {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      safeInject();
    }, 300);
  });
}
