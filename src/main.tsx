import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ExtensionPopup from "./popup/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExtensionPopup />
  </StrictMode>
);
