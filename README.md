# 🗨️ Articulate – AI-Powered LinkedIn Comment Assistant

Articulate is a Chrome extension designed to help you write thoughtful, engaging, and professional comments on LinkedIn posts—powered by cutting-edge AI like OpenAI GPT and Google Gemini.

Instead of switching between tabs or using separate tools to polish your responses, Articulate brings AI-generated comment suggestions **directly into the LinkedIn interface**, making your engagement `easier`, `smarter`, `faster`, and more `impactful`.

---

## 🚀 Features

✅ **Tone-Based AI Suggestions**  
Injects a dropdown into every LinkedIn comment box with tone options:

- Professional
- Concise
- Friendly
- Funny
- Proofread

✅ **Context-Aware Comment Generation**  
Automatically captures the **LinkedIn post content** and your typed comment, then uses AI to generate a refined version based on your selected tone.

✅ **Multi-Provider AI Support**  
Easily configure your AI provider and model:

- **OpenAI** (e.g. `gpt-4.1`)
- **Google Gemini** (e.g. `gemini-2.5-pro`)

✅ **Seamless LinkedIn Integration**  
Works on both **LinkedIn feed posts**. Retries once on DOM failure, and notifies the user if LinkedIn UI changes.

✅ **Secure Local Configuration**  
All API keys and preferences are stored **locally on your device**. Your data never leaves your browser.

---

## 🖥️ Screenshots

_[SCREENSHOTS WILL BE ADDED LATER]_

> _📷 Placeholder for Home Page_  
> _📷 Placeholder for Setup Page_  
> _📷 Placeholder for Tone Dropdown in LinkedIn Comment Box_

---

## 🖥️ Video Tutorial

_[VIDEO TUTORIAL WILL BE ADDED LATER]_

---

## 🧭 Extension Pages

| Page      | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| **Home**  | Shows the video tutorial of how to use **Articulate**                     |
| **Setup** | AI Configuration page to set up your AI Provider, API Key, and Model.     |
| **Guide** | Shows instructions for generating API keys from OpenAI and Google Gemini. |

---

## 🛠️ How It Works

1. Open any LinkedIn post.
2. Click on the **comment box**.
3. A dropdown appears with tone options.
4. Select a tone (e.g., **Professional**).
5. The extension:
   - Reads the post content and your comment.
   - Sends it to your chosen AI provider.
   - Receives a response and injects it into the comment box automatically.

---

## ⚙️ Configuration

1. Click the **Articulate** extension icon.
2. On the **Setup page**, set up your API provider:
   - Choose between **OpenAI** or **Gemini**
   - Paste your API Key
   - Select a model (render dynamically based on provider)
3. Save and start using it on LinkedIn!

---

## 📦 Technologies Used

- **TypeScript** – Core logic and type safety
- **Tailwind CSS** – UI styling
- **React** – For the extension popup UI
- **Chrome Extension APIs** – For content scripts, messaging, and storage

---

## 🛡️ Privacy & Security

- API keys are stored in **`chrome.storage.local`** (device-only).
- No data is transmitted to third-party servers.
- Your keys and LinkedIn activity stay private.

---

## 🔁 Error Handling & Feedback

If the extension fails to work due to LinkedIn UI changes:

- It **automatically retries once**.
- If it still fails:
  - An **alert is shown** to the user.

---

## 📥 Installation

Install directly from the [Chrome Web Store](https://chrome.google.com/webstore/detail/articulate/your-extension-id).

---

## ✨ Coming Soon

- Support for custom prompt
- Language switching (multilingual comments)
- Dashboard for showing API usage
- Send failure report to the developer at `mdazlaan199@gmail.com`.
- History of comments generated along with the associated **LinkedIn** post

---

## 🧑‍💻 Developed By

**Muhammad Azlaan Zubair**  
Frontend Developer | AI-Enabled Extensions | Karachi, Pakistan  
📧 mdazlaan199@gmail.com

---

## 📄 License

MIT License – Free to use, modify, and distribute.
