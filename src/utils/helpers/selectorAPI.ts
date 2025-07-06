import { dropdownCSS, getArticulateDropdown } from "./articulateDropdown";

// list of target of DOM elements
/**
 * Set a value in Chrome local storage.
 * @key feeds - Contains the selector for main feeds container and used to observe mutations.
 * @key feed_item - Contains the selector for linkedin post that contains "Post Content" & "Comment Box".
 * @key post - Contains the selector for linkedin post content container.
 * @key author - Contains the selector for linkedin post author info container.
 * @key comment_form - Contains the selector for linkedin comment-box associated with the post.
 * @key comment_editor - Contains the selector for linkedin comment-box's editor/text-box.
 * @key comment_editor_blank - Contains the selector for linkedin comment-box that tells the box has no text/comment.
 * @key inject - Contains the selector for linkedin comment-box where `Articulate` button will be injected.
 */
export const SELECT_TARGET = {
  feeds:
    'div.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]',
  feed_item:
    'div.feed-shared-update-v2[role="article"][data-urn^="urn:li:activity:"]',
  post: "div.update-components-text.update-components-update-v2__commentary[dir]",
  author: "div.update-components-actor__container span[dir]",
  comment_form: "form.comments-comment-box__form",
  comment_editor: ".ql-editor",
  comment_editor_blank: ".ql-blank",
  inject: ".comments-comment-box__detour-container",
};

export function injectAndObserve() {
  // Injecting styles for articulate dropdown
  const style = document.createElement("style");
  style.textContent = dropdownCSS;
  document.head.appendChild(style);

  // Initializing Observer
  const feedContainer = document.querySelector(SELECT_TARGET.feeds);
  if (!feedContainer || !(feedContainer instanceof HTMLElement)) {
    console.log("No Feed Found");
  } else {
    setupMutationObserver(feedContainer);
  }
}

// Function to start observer to catch DOM changes
export const setupMutationObserver = (targetElement: Element) => {
  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const mutationCallback = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(async (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            getCommentForm(node as Element);
          }
        });
      }
    }
  };
  // Create an observer instance linked to the callback function
  const feedObserver = new MutationObserver(mutationCallback);

  // Start observing the target node for configured mutations
  feedObserver.observe(targetElement, config);
};

// Function to get the comment box form i.e. `comment_form`
const getCommentForm = (node: Element) => {
  const element = node as Element;

  const commentBoxes = element.querySelectorAll(SELECT_TARGET.comment_form);
  commentBoxes.forEach((commentBox) => {
    // check of the form is an instance of HTML type
    if (commentBox instanceof HTMLElement) {
      // In order to avoid double injection of the button a custom
      // 'data' attribute is being attached with the comment-box
      // ★ NEW: if we’ve already injected into this box, bail out
      if (commentBox.hasAttribute("data-articulate-injected")) return;

      // ★ NEW: mark it so we never inject again
      commentBox.setAttribute("data-articulate-injected", "true");

      // Applying style for visibility in UI
      // commentBox.style.borderRadius = "6px";
      // commentBox.style.border = "4px solid red";

      // Injecting the button into action items row
      const actionBtnRow = commentBox.querySelector(SELECT_TARGET.inject);

      // If row exist
      if (actionBtnRow) {
        const dropdown = getArticulateDropdown(commentBox);

        // Injecting button to the comment
        actionBtnRow.prepend(dropdown);
      }
    }
  });
};

//  Function to get the main feed item associated with comment-box as main parent node i.e. `feed_item`
export const getFeedItem = (commentBox: Element): Element | null | void => {
  // Getting parent of comment-box
  let node: Element | null = commentBox.parentElement;

  // Climb-up node-by-node until the required parent node is found
  while (node) {
    // return the matching parent node
    if (
      node &&
      node.tagName === "DIV" &&
      node.getAttribute("role") === "article"
    ) {
      const dataUrn = node.getAttribute("data-urn");

      // Ensure dataUrn is not null before calling startsWith
      if (dataUrn !== null && dataUrn.startsWith("urn:li:activity:")) {
        return node;
      }
    }

    // replace the current node with its own parent node
    node = node.parentElement;
  }

  // return null if node found
  console.log("404 - Feed Item Parent Container Not Found!");
  return;
};

// Function to get post content from the feed item i.e. `post`
export const getPostContent = (feedItem: Element): string | null | void => {
  const postContainer = feedItem.querySelector(SELECT_TARGET.post);

  // return `null` if element doesn't exist or not an instance of HTML type
  if (!postContainer || !(postContainer instanceof HTMLElement)) {
    console.log("404 - Post Content Container Not Found!");
    return;
  }

  // Applying style for visibility in UI
  // postContainer.style.borderRadius = "6px";
  // postContainer.style.border = "4px solid red";

  // Explicitly handle the case where textContent might be null
  const textContent = postContainer.textContent;
  return textContent ? textContent.trim() : null;
};

// Function to get author name from the feed item i.e. `author`
export const getAuthorName = (feedItem: Element): string | null | void => {
  const authorContainer = feedItem.querySelector(SELECT_TARGET.author);

  // return `null` if element doesn't exist or not an instance of HTML type
  if (!authorContainer || !(authorContainer instanceof HTMLElement)) {
    console.log("404 - Author Data Container Not Found!");
    return;
  }

  // Applying style for visibility in UI
  // authorContainer.style.borderRadius = "6px";
  // authorContainer.style.border = "4px solid red";

  // Explicitly handle the case where textContent might be null
  const textContent = authorContainer.textContent;
  if (!textContent) return null;

  // removing duplication and return
  return removeDuplicateSubstring(textContent.trim());
};

// Function to remove duplicates from author name string if-any
const removeDuplicateSubstring = (s: string): string => {
  /**
   * If `s` contains N consecutive repeats of some substring X (i.e. X+X+…),
   * this will return just one copy of X. Otherwise returns s unchanged.
   */
  // (.+)   → capture as much as possible into group 1
  // \1+    → followed by one or more repeats of exactly that same group
  const re = /(.+)\1+/;
  const m = s.match(re);
  return m ? m[1] : s;
};
