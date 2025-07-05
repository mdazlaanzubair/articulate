// list of target of DOM elements

import type { PostContextInterface } from "../types";

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

// Function to start observer to catch DOM changes
export const setupMutationObserver = (targetElement: Element) => {
  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const mutationCallback = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
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
  if (commentBoxes.length > 0) {
    console.log("NODE", node);
    console.log("Comment Boxes", commentBoxes.length);
  }
  commentBoxes.forEach((commentBox) => {
    // check of the form is an instance of HTML type
    if (commentBox instanceof HTMLElement) {
      // Applying style for visibility in UI
      commentBox.style.borderRadius = "6px";
      commentBox.style.border = "4px solid red";

      // Injecting the button into action items row
      const actionBtnRow = commentBox.querySelector(SELECT_TARGET.inject);
      actionBtnRow && getInjectableBtn(commentBox, actionBtnRow);
      console.log("Injecting Done:", actionBtnRow);
    }
  });
};

//  Function to get the main feed item associated with comment-box as main parent node i.e. `feed_item`
const getFeedItem = (commentBox: Element): Element | null | void => {
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
const getPostContent = (feedItem: Element): string | null | void => {
  const postContainer = feedItem.querySelector(SELECT_TARGET.post);

  // return `null` if element doesn't exist or not an instance of HTML type
  if (!postContainer || !(postContainer instanceof HTMLElement)) {
    console.log("404 - Post Content Container Not Found!");
    return;
  }

  // Applying style for visibility in UI
  postContainer.style.borderRadius = "6px";
  postContainer.style.border = "4px solid red";

  // Explicitly handle the case where textContent might be null
  const textContent = postContainer.textContent;
  return textContent ? textContent.trim() : null;
};

// Function to get author name from the feed item i.e. `author`
const getAuthorName = (feedItem: Element): string | null | void => {
  const authorContainer = feedItem.querySelector(SELECT_TARGET.author);

  // return `null` if element doesn't exist or not an instance of HTML type
  if (!authorContainer || !(authorContainer instanceof HTMLElement)) {
    console.log("404 - Author Data Container Not Found!");
    return;
  }

  // Applying style for visibility in UI
  authorContainer.style.borderRadius = "6px";
  authorContainer.style.border = "4px solid red";

  // Explicitly handle the case where textContent might be null
  const textContent = authorContainer.textContent;
  if (!textContent) return null;

  // removing duplication and return
  return removeDuplicateSubstring(textContent.trim());
};

// Function to create injectable dropdown button for articulation
const getInjectableBtn = (commentBox: Element, actionBtnRow: Element): void => {
  // create a button
  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("role", "button");
  btn.setAttribute("title", "Articulate");
  btn.style.width = "4rem";
  btn.style.height = "4rem";
  btn.style.borderRadius = "50%";
  btn.style.backgroundColor = "#8c8c8c00";
  btn.style.color = "#155dfc";

  // applying hover effect
  const onHover = (hex_code: string) => (btn.style.backgroundColor = hex_code);
  btn.addEventListener("mouseenter", () => onHover("#8c8c8c1a"));
  btn.addEventListener("mouseleave", () => onHover("#8c8c8c00"));

  // Injecting icon to the button
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb-icon lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;

  // Attaching event with th button
  btn.addEventListener("click", () => articulateComment(commentBox));

  // Injecting button to the comment
  actionBtnRow.prepend(btn);
};

// Event listener function to be attached with the articulate injectable button
const articulateComment = (commentBox: Element) => {
  // Object to contain all context required for comment generation
  const postContext: PostContextInterface = {
    author: null,
    post: null,
    user_comment: null,
  };

  // 1. Checking if user comment exist
  const qlEditor = commentBox.querySelector(SELECT_TARGET.comment_editor);
  if (qlEditor) {
    // Checking if the comment-box is not empty
    const isBlank = qlEditor.classList.contains(
      SELECT_TARGET.comment_editor_blank
    );

    if (!isBlank) {
      const textContent = qlEditor.textContent;
      postContext.user_comment = textContent && textContent?.trim();
    }
  }

  // 2. Getting feed item to extract the post and author information
  const feedItem = getFeedItem(commentBox);

  if (feedItem) {
    // 2.a. Post Content
    postContext.post = getPostContent(feedItem) || null;

    // 2.b. Author Name
    postContext.author = getAuthorName(feedItem) || null;
  }

  // 3. Generate Prompt from the post context
  console.log("=============>");
  console.log("POST:", postContext.post);
  console.log(`BY: --${postContext.author}`);
  console.log("User Comment:", postContext.user_comment);
  console.log("=============>");

  // 4. Pushing the generated comment back to the comment-box
  if (qlEditor) {
    qlEditor.innerHTML = `<p>${JSON.stringify(postContext)}</p>`;
  }
};

/**
 * If `s` contains N consecutive repeats of some substring X (i.e. X+X+…),
 * this will return just one copy of X. Otherwise returns s unchanged.
 */
const removeDuplicateSubstring = (s: string): string => {
  // (.+)   → capture as much as possible into group 1
  // \1+    → followed by one or more repeats of exactly that same group
  const re = /(.+)\1+/;
  const m = s.match(re);
  return m ? m[1] : s;
};
