// Function to checks if an OpenAI API key is valid by making a lightweight test call.
export async function testOpenAIKeyAndModel(
  apiKey: string,
  selectedModel: string
): Promise<boolean> {
  // 1️⃣ List models
  let listRes: Response;
  try {
    listRes = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } catch (networkErr: any) {
    throw new Error(`Network error listing models: ${networkErr.message}`);
  }

  if (listRes.status === 401) {
    throw new Error("Invalid OpenAI API key");
  }
  if (!listRes.ok) {
    throw new Error(
      `Failed to list models: ${listRes.status} ${listRes.statusText}`
    );
  }

  const listJson = await listRes.json();
  const availableModels: string[] = Array.isArray(listJson.data)
    ? listJson.data.map((m: any) => m.id)
    : [];

  if (!availableModels.length) {
    throw new Error("No models returned from OpenAI. Is your API key valid?");
  }

  if (!availableModels.includes(selectedModel)) {
    throw new Error(`Model "${selectedModel}" not found`);
  }

  // 2️⃣ Minimal chat completion to verify key/model
  let chatRes: Response;
  try {
    chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 1,
        temperature: 0.0,
      }),
    });
  } catch (networkErr: any) {
    throw new Error(
      `Network error during test completion: ${networkErr.message}`
    );
  }

  if (chatRes.status === 401) {
    throw new Error("Invalid OpenAI API key");
  }
  if (!chatRes.ok) {
    const errBody = await chatRes.json().catch(() => ({}));
    throw new Error(
      `Test completion failed: ${chatRes.status} ${chatRes.statusText}` +
        (errBody.error?.message ? ` - ${errBody.error.message}` : "")
    );
  }

  return true;
}

// Function to test Gemini API key and model availability using direct API calls
export async function testGeminiKeyAndModel(
  apiKey: string,
  selectedModel: string
): Promise<boolean> {
  // 1. Query models endpoint
  let listResp;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const resp = await fetch(url);
    if (resp.status === 401) throw new Error("Invalid API key");
    listResp = await resp.json();
  } catch (err: any) {
    throw new Error(`Gemini list-models failed: ${err.message || err}`);
  }

  if (!Array.isArray(listResp.models)) {
    throw new Error("Gemini API: models array not found in response");
  }

  let isModelAvailable = false;
  for (const model of listResp.models) {
    const modelName: string = model.name;
    if (modelName.includes(selectedModel)) {
      isModelAvailable = true;
      break;
    }
  }

  if (!isModelAvailable) {
    throw new Error(`Model "${selectedModel}" not found`);
  }

  // 2. Lightweight generate to verify key/model
  const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent`;

  try {
    const response = await fetch(generateUrl, {
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
                text: "Hello",
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
      throw new Error("Empty generate response");
    }

    return true;
  } catch (err: any) {
    if ((err.message || "").toLowerCase().includes("unauthorized")) {
      throw new Error("Invalid API key");
    }
    throw new Error(`Gemini generate failed: ${err.message || err}`);
  }
}
