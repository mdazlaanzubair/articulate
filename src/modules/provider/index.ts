import type { AIParamsInterface } from "../../utils/types";
import { generateGeminiComment } from "./sources/geminiAI";
import { generateOpenAIComment } from "./sources/openAI";

// Function to make appropriate API call to the selected AI provider
export const generateAIComment = async (params: AIParamsInterface) => {
  const { api_key, model, prompt, provider } = params;

  if (!api_key || !model || !prompt || !provider) {
    const errMsg =
      "Any of these 'api_key', 'model', 'provider', or 'prompt' required params are missing";
    throw new Error(errMsg);
  }

  try {
    let aiGeneratedComment = "";
    if (provider === "gemini") {
      aiGeneratedComment = await generateGeminiComment(params);
    } else if (provider === "openai") {
      aiGeneratedComment = await generateOpenAIComment(params);
    }
    return aiGeneratedComment;
  } catch (error) {
    console.error("Error in API call:", error);
    throw new Error("Something went wrong while communicating with AI Agents.");
  }
};
