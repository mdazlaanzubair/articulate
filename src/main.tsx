import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router";
import Welcome from "./pages/WelcomePage.tsx";
import App from "./App.tsx";
import { AppRouter } from "./router/AppRouter.tsx";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signUpFallbackRedirectUrl="/"
      signInFallbackRedirectUrl="/"
    >
      <ThemeProvider defaultTheme="dark" storageKey="articulate-ui-theme">
        <AppRouter />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);
