import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import type { AIParamsInterface } from "../types";

// ######################
// AI Comment Generators
// ######################

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

// Function to generate a comment via Google's Gemini API.
export async function generateGeminiComment(
  params: AIParamsInterface
): Promise<string> {
  // destructuring params
  const { prompt, apiKey, model } = params || null;

  // initializing client
  const ai = new GoogleGenAI({ apiKey });

  // making api call
  try {
    const resp = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    if (!resp.text) throw new Error("Empty response from Gemini");
    return resp.text.trim();
  } catch (err: any) {
    console.error("Gemini API error", err);
    throw new Error(`Gemini request failed: ${err.message || err}`);
  }
}

// ###################
// AI VALIDATORS
// ###################

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
        max_tokens: 1, // very small response
        temperature: 0.0, // deterministic
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

  // success
  return true;
}

// Function to checks if a Gemini API key is valid by sending a small test prompt.
export async function testGeminiKeyAndModel(
  apiKey: string,
  selectedModel: string
): Promise<boolean> {
  // 1. Query models endpoint
  let listResp = [];
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models`;
    const resp = await fetch(`${url}?key=${apiKey}`);
    if (resp.status === 401) throw new Error("Invalid API key");
    listResp = await resp.json();
  } catch (err: any) {
    throw new Error(`Gemini list-models failed: ${err.message || err}`);
  }

  let isModelAvailable: boolean = false;
  for (const model of listResp) {
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
  const ai = new GoogleGenAI({ apiKey });
  try {
    const resp = await ai.models.generateContent({
      model: selectedModel,
      contents: "Hello",
    });
    if (!resp.text) throw new Error("Empty generate response");
    return true;
  } catch (err: any) {
    if ((err.message || "").toLowerCase().includes("unauthorized")) {
      throw new Error("Invalid API key");
    }
    throw new Error(`Gemini generate failed: ${err.message || err}`);
  }
}
