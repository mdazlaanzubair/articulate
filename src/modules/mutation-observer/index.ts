import { getCommentForm } from "../dom-selectors/selectorAPIs";
import { SELECT_TARGET } from "../dom-selectors/targetedKeys";
import { dropdownCSS } from "../ui/dropdownBtn";

/**
 * Injects necessary styles and initializes the MutationObserver to observe DOM changes.
 */
export function injectAndObserve(): void {
  injectStyles();
  const feedContainer = document.querySelector<HTMLElement>(
    SELECT_TARGET.feeds
  );

  if (!feedContainer) {
    console.warn("No feed container found.");
    return;
  }

  setupMutationObserver(feedContainer);
}

/**
 * Injects the CSS styles required for the dropdown into the document head.
 */
function injectStyles(): void {
  const style = document.createElement("style");
  style.textContent = dropdownCSS;
  document.head.appendChild(style);
  console.log("Styles injected successfully.");
}

/**
 * Sets up a MutationObserver to observe changes in the DOM.
 * @param {HTMLElement} targetElement - The DOM element to observe.
 */
export function setupMutationObserver(targetElement: Element): void {
  const config = { childList: true, subtree: true };

  const mutationCallback = (mutationList: MutationRecord[]) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            try {
              getCommentForm(node as Element);
            } catch (error) {
              console.error("Error processing node:", error);
            }
          }
        });
      }
    });
  };

  const feedObserver = new MutationObserver(mutationCallback);
  feedObserver.observe(targetElement, config);
  console.log("MutationObserver set up successfully.");
}
