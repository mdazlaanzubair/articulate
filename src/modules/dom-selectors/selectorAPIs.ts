import { createArticulateDropdown } from "../ui/dropdownBtn";
import { SELECT_TARGET } from "./targetedKeys";

// Function to get the comment box form
export const getCommentForm = (node: Element): void => {
  const element = node as Element;
  const commentBoxes = element.querySelectorAll(SELECT_TARGET.comment_form);

  commentBoxes.forEach((commentBox) => {
    if (commentBox instanceof HTMLElement) {
      // Avoid double injection of the button using a custom data attribute
      if (commentBox.hasAttribute("data-articulate-injected")) {
        return;
      }

      // Mark the comment box to avoid re-injection
      commentBox.setAttribute("data-articulate-injected", "true");

      // Injecting the button into action items row
      const actionBtnRow = commentBox.querySelector(SELECT_TARGET.inject);

      if (actionBtnRow) {
        const dropdown = createArticulateDropdown(commentBox);
        actionBtnRow.prepend(dropdown);
      }
    }
  });
};

// Function to get the main feed item associated with the comment box
export const getFeedItem = (commentBox: Element): Element | null => {
  let node: Element | null = commentBox.parentElement;

  // Traverse up the DOM tree to find the feed item
  while (node) {
    if (node.tagName === "DIV" && node.getAttribute("role") === "article") {
      const dataUrn = node.getAttribute("data-urn");
      if (dataUrn && dataUrn.startsWith("urn:li:activity:")) {
        return node;
      }
    }
    node = node.parentElement;
  }

  console.warn("Feed Item Parent Container Not Found!");
  return null;
};

// Function to get post content from the feed item
export const getPostContent = (feedItem: Element): string | null => {
  const postContainer = feedItem.querySelector(SELECT_TARGET.post);

  if (!postContainer || !(postContainer instanceof HTMLElement)) {
    console.warn("Post Content Container Not Found!");
    return null;
  }

  const textContent = postContainer.textContent;
  return textContent ? textContent.trim() : null;
};

// Function to get author name from the feed item
export const getAuthorName = (feedItem: Element): string | null => {
  const authorContainer = feedItem.querySelector(SELECT_TARGET.author);

  if (!authorContainer || !(authorContainer instanceof HTMLElement)) {
    console.warn("Author Data Container Not Found!");
    return null;
  }

  const textContent = authorContainer.textContent;
  if (!textContent) {
    return null;
  }

  return removeDuplicateSubstring(textContent.trim());
};

// Function to remove duplicates from author name string if any
const removeDuplicateSubstring = (s: string): string => {
  /**
   * If `s` contains N consecutive repeats of some substring X (i.e. X+X+...),
   * this will return just one copy of X. Otherwise returns s unchanged.
   */
  const re = /(.+)\1+/;
  const m = s.match(re);
  return m ? m[1] : s;
};
