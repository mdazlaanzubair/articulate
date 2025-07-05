import {
  SELECT_TARGET,
  setupMutationObserver,
} from "../utils/helpers/selectorAPI";

console.log("Content TS coming from Src");

// Initializing Observer
const feedContainer = document.querySelector(SELECT_TARGET.feeds);
if (!feedContainer || !(feedContainer instanceof HTMLElement)) {
  console.log("No Feed Found");
} else {
  setupMutationObserver(feedContainer);
}
