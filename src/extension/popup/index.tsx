import { useState } from "react";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { appPages } from "./pages";
import { FileWarning, House, Text, Webhook } from "lucide-react";

const ExtensionPopup = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const [activeTab, setActiveTab] = useState<string>("home-page");
  const pageSwitcher = (slug: string) => setActiveTab(slug);

  return (
    <div
      data-theme={isDarkMode ? "night" : "winter"}
      className="flex flex-col items-center w-[300px] h-[570px] bg-base-200 overflow-hidden"
    >
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
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
