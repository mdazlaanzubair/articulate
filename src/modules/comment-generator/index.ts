import { USER_CONFIG } from "../../content-script";
import { generateAIComment } from "../../modules/provider";
import type { PostContextInterface, ToneType } from "../../utils/types";
import {
  getAuthorName,
  getFeedItem,
  getPostContent,
} from "../dom-selectors/selectorAPIs";
import { SELECT_TARGET } from "../dom-selectors/targetedKeys";
import { generateDynamicPrompt } from "./dynamicPrompGenerator";

// Generates and articulates a comment based on the provided comment box and tone.
export const articulateAIComment = async (
  commentBox: Element,
  tone: ToneType
): Promise<void> => {
  const postContext: PostContextInterface = {
    tone,
    author: null,
    post: null,
    user_comment: null,
  };

  // Extract user comment if it exists and is not empty
  const qlEditor = commentBox.querySelector(SELECT_TARGET.comment_editor);
  if (qlEditor) {
    const isBlank = qlEditor.classList.contains(
      SELECT_TARGET.comment_editor_blank
    );
    if (!isBlank && qlEditor.textContent) {
      postContext.user_comment = qlEditor.textContent.trim();
    }
  }

  // Extract post content and author information
  const feedItem = getFeedItem(commentBox);
  if (feedItem) {
    postContext.post = getPostContent(feedItem) || null;
    postContext.author = getAuthorName(feedItem) || null;
  }

  // Generate prompt from the post context
  const { isError, error_msg, prompt } = generateDynamicPrompt(postContext);

  // Handle errors and generate AI comment
  let finalizedComment = "";
  let secondsElapsed = 0;
  let timerInterval;

  if (isError || !prompt || prompt.length <= 0) {
    finalizedComment = error_msg || "An unknown error occurred.";
  } else {
    try {
      if (!USER_CONFIG) {
        throw new Error("AI Configs are missing, please setup!");
      }

      const reqParams = {
        ...USER_CONFIG,
        prompt,
      };

      // Start the timer
      timerInterval = setInterval(() => {
        secondsElapsed++;
        if (qlEditor) {
          let loadingPlaceholder = `Preparing comment... (${secondsElapsed}s)`;
          qlEditor.setAttribute("placeholder", loadingPlaceholder);
          qlEditor.ariaPlaceholder = loadingPlaceholder;
        }
      }, 1000);

      const aiComment = await generateAIComment(reqParams);
      finalizedComment = aiComment;
    } catch (error) {
      console.error("Error generating AI comment:", error);
      finalizedComment = "Failed to generate comment due to an error.";
    } finally {
      // Clear the interval when the response is received
      if (timerInterval) {
        if (qlEditor) {
          qlEditor.setAttribute("placeholder", "Add a comment…");
          qlEditor.ariaPlaceholder = "Add a comment…";
        }
        clearInterval(timerInterval);
      }
    }
  }

  // Push the generated comment back to the comment box
  if (qlEditor) {
    qlEditor.innerHTML = `<p>${finalizedComment}</p>`;
  }
};
