import type { AIParamsInterface } from "../../../utils/types";

// Function to generate a comment via Google's Gemini API using direct API calls
export async function generateGeminiComment(
  params: AIParamsInterface
): Promise<string> {
  const { prompt, api_key, model } = params || {};

  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": api_key,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error("Empty response from Gemini");
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (err: any) {
    console.error("Gemini API error", err);
    throw new Error(`Gemini request failed: ${err.message || err}`);
  }
}
