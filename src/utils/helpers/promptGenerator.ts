import type {
  DynamicPromptInterface,
  PostContentValidation,
  PostContextInterface,
} from "../types";

const COMMENT_TONES = {
  professional: `Rewrite or generate the comment in a **Professional Tone**. The language should be formal, respectful, 
    and suitable for a corporate or academic audience. Use industry-appropriate terminology if the context 
    allows, but prioritize clarity and conciseness. Avoid slang, overly casual language, and personal 
    anecdotes unless the 'user_comment' already includes them.`,
  concise: `Rewrite or generate the comment in a **Concise Tone**. The primary goal is to be as brief as 
  possible while retaining the core message. Eliminate any filler words, redundant phrases, or sentences 
  that do not add significant value. The final comment should be direct and to the point.`,
  funny: `Rewrite or generate the comment in a **Funny Tone**. The humor should be witty, clever, and appropriate 
  for a professional platform like LinkedIn. Avoid anything that could be considered offensive, unprofessional, 
  or a simple joke. Puns, clever observations, or a lighthearted take on the 'postContent' are good options. 
  If the 'postContent' or 'userComment' is serious, lean towards a more subtly humorous and positive observation.`,
  friendly: `Rewrite or generate the comment in a **Friendly Tone**. The language should be warm, approachable, 
  and encouraging. Use positive language and a conversational style that feels genuine and supportive. 
  Contractions (e.g., "don't," "it's") are acceptable. The goal is to build rapport and create a positive 
  interaction.`,
  proofread: `Your task is to **Proofread** the 'userComment'. Correct any and all spelling, grammar, and 
  punctuation errors. Improve sentence structure for better clarity and flow. **Crucially, do not change the 
  user's original tone or intent**. If no 'userComment' is provided, generate a grammatically perfect, neutral, 
  and insightful question related to the 'postContent'.`,
};

// Function to dynamically generate prompt
export const generateDynamicPrompt = (
  postContext: PostContextInterface
): DynamicPromptInterface => {
  const { post, author, user_comment, tone } = postContext || null;

  // Validating the context before generating prompt
  const { isError, error_msg } = postContextValidation(post, user_comment);

  // Base prompt that carries universal instruction for the AI model
  const BASE_PROMPT = `
  You are an AI assistant integrated into a Chrome extension named "Articulate." Your sole purpose is to help users write or refine comments on LinkedIn posts. You must generate a response that is only the comment itself, without any additional text, explanation, or markdown.
  
  Use the same language as of the text of the post you are receiving in the user's prompt. Please sound like a human being. Don't use hashtags, use emojis occasionally, don't repeat too many of the exact words, but simply create a brief and positive reply.  Maybe add something to the discussion. Be creative! You may mention the name of the author, if it's the name of a natural person. Don't mention the name if it's the name of a company or a LinkedIn group.

  Here is the context you have to work with:
  
  * **LinkedIn Post Content by Author Name:${author} ('postContent'):** ${post}
  
  * **User's Draft Comment ('user_comment'):** ${user_comment}
  
  **Your Task:**
  
  Based on the provided 'postContent' and 'userComment', generate a single, ready-to-paste comment. Adhere to the following rules based on the information available:
  
  * **If 'userComment' and 'postContent' are both available:** Rewrite the 'userComment' to reflect the chosen tone, using the 'postContent' to ensure the comment is highly relevant and contextual. The core idea of the 'userComment' should be preserved.
  * **If only 'postContent' is available ('userComment' is null):** Write a new, insightful comment that directly relates to the 'postContent' in the specified tone.
  * **If only 'userComment' is available ('postContent' is null):** Rewrite the 'userComment' to match the chosen tone, focusing solely on the user's text.
  * **If neither is available ('postContent' and 'userComment' are null):** Provide a polite, generic, and engaging question to encourage discussion.
  
  **CRITICAL OUTPUT INSTRUCTION:** Your entire response must be only the final comment text. Do not include phrases like "Here is the comment:", "Sure, here you go:", or any other conversational filler. Do not use any markdown.
  
  **FOLLOWING IS THE TONE-SPECIFIC INSTRUCTIONS:**

  ${COMMENT_TONES[tone]}
  `;

  return {
    isError,
    error_msg,
    prompt: isError ? null : BASE_PROMPT,
  };
};

/**
 * Validates 'post' and 'comment' fields based on word count and presence.
 *
 * @param {string | null | undefined} post - The content of the LinkedIn post.
 * @param {string | null | undefined} comment - The user's draft comment.
 * @returns {{isValid: boolean, message: string}} An object indicating validation status and a message.
 */
function postContextValidation(
  post: string | null,
  comment: string | null
): PostContentValidation {
  // Helper function to calculate the word count of a given text.
  // It handles null, undefined, or empty strings by returning 0.
  // Words are counted by splitting the string by one or more whitespace characters
  // and then filtering out any empty strings that might result from multiple spaces.
  const getWordCount = (text: string | null) => {
    if (!text) {
      return 0;
    }
    const words = text.split(/\s+/).filter(Boolean);
    return words.length;
  };

  // The minimum number of words required for a field to be considered "present".
  const MIN_WORDS_REQUIRED = 5;

  // Calculate word counts for both the post and the comment.
  const postWordCount = getWordCount(post);
  const commentWordCount = getWordCount(comment);

  // Determine if the post or comment content is considered "present"
  // based on whether its word count exceeds the minimum required.
  const isPostPresent = postWordCount > MIN_WORDS_REQUIRED;
  const isCommentPresent = commentWordCount > MIN_WORDS_REQUIRED;

  // Condition 1: At least one field (post or comment) must have more than 5 words.
  // If this condition is met, the validation is successful.
  if (isPostPresent || isCommentPresent) {
    return { isError: false, error_msg: null };
  }

  // Condition 2: If neither the post nor the comment has enough words (i.e., both are not "present"),
  // then an error message is returned. The prompt provides two similar messages for this scenario;
  // this implementation uses the one that directly states the AI's need for context.
  return {
    isError: true,
    error_msg:
      "I can't understand the post. Kindly write something to give me some context about it, and then I'll start writing.",
  };
}
