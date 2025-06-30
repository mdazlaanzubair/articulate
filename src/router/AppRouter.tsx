import App from "@/App";
import { SetupPage } from "@/pages/setup/SetupPage";
import WelcomePage from "@/pages/WelcomePage";
import { BrowserRouter, Route, Routes } from "react-router";
import { RouteProtector } from "./RouteProtector";
import { APIKeyGuidePage } from "@/pages/setup-guide/APIKeyGuidePage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<WelcomePage />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="guide" element={<APIKeyGuidePage />} />
          <Route path="/" element={<RouteProtector />}>
            <Route path="setup" element={<SetupPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
