export const providers_list = [
  {
    title: "Google Gemini",
    slug: "gemini",
    isRecommended: true,
  },
  {
    title: "OpenAI GPT",
    slug: "openai",
    isRecommended: false,
  },
];

// LIST OF AI MODELS
export interface AIObjInterface {
  title: string;
  slug: string;
  isRecommended: boolean;
}

export const openai_models_list = [
  {
    title: "GPT-4.1",
    slug: "gpt-4.1-2025-04-14",
    isRecommended: true,
  },
  { title: "ChatGPT-4o", slug: "chatgpt-4o-latest", isRecommended: false },
  { title: "o3", slug: "o3-2025-04-16", isRecommended: false },
  { title: "o3-mini", slug: "o3-mini-2025-01-31", isRecommended: false },
];

export const gemini_models_list = [
  {
    title: "Gemini 2.5 Pro",
    slug: "gemini-2.5-pro",
    isRecommended: true,
  },
  {
    title: "Gemini 2.5 Flash",
    slug: "gemini-2.5-flash",
    isRecommended: false,
  },
  {
    title: "Gemini 2.0 Flash",
    slug: "gemini-2.0-flash",
    isRecommended: false,
  },
  {
    title: "Gemini 2.0 Flash-Lite",
    slug: "gemini-2.0-flash-lite",
    isRecommended: false,
  },
];
