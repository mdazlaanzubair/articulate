// Data for each AI provider's API key guide
export const providerGuides = {
  gemini: {
    meta_data: {
      title: "Google Gemini API Key Guide",
      desc:
        "Follow these steps to obtain your gemini API Key from Google AI Studio.",
      video: {
        title: "Google Gemini API Key Guide",

        url: "https://www.youtube.com/embed/o8iyrtQyrZM?si=A8G-9BI8Bw7BU-ka",
      },
      official_docs: {
        label: "Checkout Official Docs",
        url: "https://ai.google.dev/gemini-api/docs/api-key",
      },
    },
    steps: [
      {
        title: "Navigate to Google AI Studio",
        content:
          "Go to the Google AI Studio website. You will need a Google account to proceed.",
      },
      {
        title: "Create New API Key",
        content:
          'On the Google AI Studio dashboard, look for the "Get API key" or "Create API key" option. You might need to create a new project first.',
      },
      {
        title: "Copy Your API Key",
        content:
          "Once generated, copy your API key. Keep it secure as it grants access to your Gemini usage.",
      },
    ],
  },
  openai: {
    meta_data: {
      title: "OpenAI API Key Guide",
      desc:
        "Learn how to get your OpenAI API Key for models like GPT-3.5 and GPT-4.",
      video: {
        title: "OpenAI API Key Guide",

        url: "https://www.youtube.com/embed/OB99E7Y1cMA?si=qQrwSIWCFVicK0-c",
      },
      official_docs: {
        label: "Checkout Official Docs",
        url: "https://platform.openai.com/docs/api-reference/introduction",
      },
    },
    steps: [
      {
        title: "Sign in to OpenAI Platform",
        content:
          "Visit the OpenAI platform website and sign in to your account. If you don't have one, create it.",
      },
      {
        title: "Access API Keys Section",
        content:
          'After logging in, navigate to the "API keys" section. This is usually found in your user settings or profile.',
      },
      {
        title: "Create New Secret Key",
        content:
          'Click on "Create new secret key". You can give it a name for easier identification. Copy the key immediately as it will not be shown again.',
      },
    ],
  },
};
