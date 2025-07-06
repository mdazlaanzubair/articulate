import type { AIParamsInterface } from "../types";

// Function to generate a comment via OpenAI's API.
export async function generateOpenAIComment(
  params: AIParamsInterface
): Promise<string> {
  const { prompt, apiKey, model } = params;
  if (!prompt || !apiKey || !model) {
    throw new Error("Missing prompt, apiKey, or model");
  }

  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });
  } catch (networkErr: any) {
    console.error("Network error calling OpenAI:", networkErr);
    throw new Error(`OpenAI request failed: ${networkErr.message}`);
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.error?.message || res.statusText;
    console.error("OpenAI API error:", body.error);
    throw new Error(`OpenAI API error: ${msg}`);
  }

  const text = body.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Empty response from OpenAI");
  }

  return text.trim();
}

// Function to generate a comment via Google's Gemini API using direct API calls
export async function generateGeminiComment(
  params: AIParamsInterface
): Promise<string> {
  const { prompt, apiKey, model } = params || {};

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
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
