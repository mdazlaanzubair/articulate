import type { PostContextInterface, ToneType } from "../types";
import { generateDynamicPrompt } from "./dynamicPrompGenerator";
import {
  getAuthorName,
  getFeedItem,
  getPostContent,
  SELECT_TARGET,
} from "./selectorAPI";

// Event listener function to be attached with the articulate injectable button
export const articulateComment = (
  commentBox: Element,
  tone: ToneType = "professional"
): void => {
  // Object to contain all context required for comment generation
  const postContext: PostContextInterface = {
    tone,
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
  const { isError, error_msg, prompt } = generateDynamicPrompt(postContext);
  console.log("<==============>");
  console.log(" DYNAMIC PROMPT");
  console.log("<==============>");
  console.log(isError ? error_msg : prompt);

  // 4. Pushing the generated comment back to the comment-box
  if (qlEditor) {
    qlEditor.innerHTML = `<p>${isError ? error_msg : prompt}</p>`;
  }
};
