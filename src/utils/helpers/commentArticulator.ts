import { USER_CONFIG } from "../../extension/content-script";
import type { PostContextInterface, ToneType } from "../types";
import {
  generateGeminiComment,
  generateOpenAIComment,
} from "./aiCommunicationAPI";
import { generateDynamicPrompt } from "./dynamicPrompGenerator";
import {
  getAuthorName,
  getFeedItem,
  getPostContent,
  SELECT_TARGET,
} from "./selectorAPI";

// Event listener function to be attached with the articulate injectable button
export const articulateComment = async (
  commentBox: Element,
  tone: ToneType
): Promise<void> => {
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

  // 4. Making API call to generate comment
  let finalizedComment = "";
  let secondsElapsed = 0; // Counter for seconds elapsed
  let timerInterval; // To store the interval ID

  if (isError) {
    finalizedComment = `${error_msg}`;
  } else {
    try {
      // Start the timer
      timerInterval = setInterval(() => {
        secondsElapsed++;
        if (qlEditor) {
          qlEditor.innerHTML = `<p>Preparing comment... (${secondsElapsed}s)</p>`;
        }
      }, 1000);

      const aiComment = await generateAiComment(prompt as string);
      finalizedComment = `${aiComment}`;
    } finally {
      // Clear the interval when the response is received
      clearInterval(timerInterval);
    }
  }

  // 5. Pushing the generated comment back to the comment-box
  if (qlEditor) {
    qlEditor.innerHTML = `<p>${finalizedComment}</p>`;
  }
};

// Function to perform AI calls to AI agent based on the provider selected
const generateAiComment = async (prompt: string): Promise<string> => {
  try {
    if (!USER_CONFIG) throw new Error("AI Configs are missing, please setup!");

    const reqParams = {
      apiKey: USER_CONFIG.api_key,
      model: USER_CONFIG.model,
      prompt,
    };

    let aiGeneratedComment = "";
    if (USER_CONFIG.provider === "openai") {
      aiGeneratedComment = await generateOpenAIComment(reqParams);
    } else {
      aiGeneratedComment = await generateGeminiComment(reqParams);
    }

    return aiGeneratedComment;
  } catch (error) {
    console.error(error);
    return "Something went wrong while communicating with AI Agent.";
  }
};
