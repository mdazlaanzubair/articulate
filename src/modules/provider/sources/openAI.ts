import type { AIParamsInterface } from "../../../utils/types";

// Function to generate a comment via OpenAI's API.
export async function generateOpenAIComment(
  params: AIParamsInterface
): Promise<string> {
  const { prompt, api_key, model } = params;
  if (!prompt || !api_key || !model) {
    throw new Error("Missing prompt, apiKey, or model");
  }

  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
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
