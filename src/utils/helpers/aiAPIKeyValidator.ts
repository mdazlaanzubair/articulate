import type { AIModelInterface } from "../types";

// Function to validate the OpenAI API key and fetch available text models
export async function validateAPIKeyAndFetchModelsOpenAI(
  apiKey: string
): Promise<AIModelInterface[]> {
  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } catch (networkErr: any) {
    throw new Error(`Network error: ${networkErr.message}`);
  }

  if (res.status === 401) {
    throw new Error("Invalid OpenAI API key");
  }

  if (!res.ok) {
    throw new Error(`Failed to list models: ${res.status} ${res.statusText}`);
  }

  const listJson = await res.json();
  const excludeKeywords = [
    "audio",
    "tts",
    "whisper",
    "dall-e",
    "embedding",
    "image",
    "codex",
    "moderation",
    "search",
    "transcribe",
    "realtime",
    "turbo",
    "preview",
    "chatgpt",
    "0613",
    "nano",
  ];

  const models: AIModelInterface[] = Array.isArray(listJson.data)
    ? listJson.data
        .map((m: any) => m.id)
        .filter(
          (id: string) =>
            (id.startsWith("gpt-") || id.startsWith("o")) &&
            !excludeKeywords.some((kw) => id.includes(kw))
        )
        .map((id: string) => ({
          slug: id,
          title: id.replace(/-/g, " ").toUpperCase(),
        }))
    : [];

  if (!models.length) {
    throw new Error("No valid text models found for this API key.");
  }

  return models;
}

// Validates Gemini API key and returns list of available text models
interface GeminiModel {
  slug: string;
  title: string;
}

export async function validateAPIKeyAndFetchModelsGemini(
  apiKey: string
): Promise<GeminiModel[]> {
  const EXCLUDED_KEYWORDS = [
    "embedding",
    "vision",
    "tts",
    "image",
    "aqa",
    "answer",
    "gemma",
    "preview",
    "aqa",
    "learn",
    "8b",
    "experimental",
    "002",
    "001",
  ];

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const resp = await fetch(url);
    if (resp.status === 401) throw new Error("Invalid Gemini API key");

    const listJson = await resp.json();
    const models = Array.isArray(listJson.models) ? listJson.models : [];

    const textModels = models
      .filter((model: any) => {
        const name = model.name.toLowerCase();
        const displayName = model.displayName.toLowerCase();
        const supportsText = (model.supportedGenerationMethods || []).includes(
          "generateContent"
        );

        // Exclude if name contains any unwanted keywords
        const text = `${displayName} ${name}`;
        const isExcluded = EXCLUDED_KEYWORDS.some((kw) => text.includes(kw));
        return supportsText && !isExcluded;
      })
      .map((model: any) => ({
        slug: model.name,
        title: model.displayName,
      }));

    if (!textModels.length) {
      throw new Error("No suitable text models found for this API key.");
    }

    return textModels;
  } catch (err: any) {
    throw new Error(`Gemini API error: ${err.message || err}`);
  }
}
