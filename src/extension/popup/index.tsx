import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { appPages } from "./pages";
import { FileWarning, House, Text, Webhook } from "lucide-react";
import { getStoredData } from "../../utils/helpers/storageAPI";
import PopupAlert from "./components/PopupAlert";

const ExtensionPopup = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const [activeTab, setActiveTab] = useState<string>("home-page");
  const pageSwitcher = (slug: string) => setActiveTab(slug);
  const [message, setMessage] = useState<any | null>({
    type: "loading",
    message: "Checking AI Configs...",
  });

  useEffect(() => {
    async function init() {
      // 1. Get config from storage
      const userConfig = (await getStoredData("user_config")) || null;
      if (!userConfig) {
        setMessage({
          type: "no-config",
          message: "AI Configs are missing, please setup!",
        });
        return;
      }

      // 2. Get active tab URL
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = tabs[0]?.url || "";
      if (!url.startsWith("https://www.linkedin.com/feed/")) {
        setMessage({
          type: "no-feed",
          message: "Kindly go to the feed page https://www.linkedin.com/feed/",
        });
        return;
      }

      // 3. Decide what to show
      if (url.startsWith("https://www.linkedin.com/feed/")) {
        setMessage(null);
      }
    }

    init();
  }, [activeTab]);

  return (
    <div
      data-theme={isDarkMode ? "night" : "winter"}
      className="flex flex-col items-center w-[300px] h-[570px] bg-base-200 overflow-hidden"
    >
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <PopupAlert message={message?.message} type={message?.type} />
      <main className="max-w-[500px] tabs tabs-border w-full h-full bg-base-200 overflow-hidden">
        {appPages.map(({ title, slug, element }) => (
          <>
            <label
              className={`tab gap-2 ${
                slug === activeTab ? "tab-active border-accent" : ""
              }`}
              title={title}
            >
              {slug == "home-page" ? (
                <House className="w-4 h-4" />
              ) : slug === "guide-page" ? (
                <Text className="w-4 h-4" />
              ) : slug === "setup-page" ? (
                <Webhook className="w-4 h-4" />
              ) : (
                <FileWarning className="w-4 h-4" />
              )}
              <input
                type="radio"
                name="pages"
                aria-label={title}
                onClick={() => pageSwitcher(slug)}
              />
              {title}
            </label>
            <div className="tab-content w-full h-full grow bg-base-100">
              {element}
            </div>
          </>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default ExtensionPopup;
