import { useState } from "react";
import GuideContent from "./components/GuideContent";

const guide_data = [
  {
    id: 1,
    slug: "gemini",
    title: "How to get Gemini API Key",
    url: "https://ai.google.dev/gemini-api/docs/api-key",
    video: {
      title: "How to get Gemini API - Video",
      url: "https://www.youtube.com/embed/o8iyrtQyrZM?si=A8G-9BI8Bw7BU-ka",
    },
  },
  {
    id: 2,
    slug: "openai",
    title: "OpenAI API Key Guide",
    url: "https://platform.openai.com/docs/api-reference/introduction",
    video: {
      title: "OpenAI API Key Guidey - Video",
      url: "https://www.youtube.com/embed/OB99E7Y1cMA?si=qQrwSIWCFVicK0-c",
    },
  },
];

const GuidePage = () => {
  const [activeTab, setActiveTab] = useState<string>("gemini");
  const pageSwitcher = (slug: string) => setActiveTab(slug);

  return (
    <section className="w-full h-full flex flex-col items-center gap-5 overflow-x-hidden overflow-y-auto px-5 py-2">
      <main className="max-w-[500px] tabs w-full h- overflow-hidden">
        {guide_data.map(({ title, slug, url, video, id }) => (
          <>
            <label
              className={`tab gap-2 capitalize ${
                slug === activeTab ? "tab-active border-accent" : ""
              }`}
              title={title}
            >
              <input
                type="radio"
                name="pages"
                aria-label={title}
                onClick={() => pageSwitcher(slug)}
              />
              {slug}
            </label>
            <div className="tab-content w-full h-full grow bg-base-100 py-3">
              <GuideContent id={id} title={title} url={url} video={video} />
            </div>
          </>
        ))}
      </main>
    </section>
  );
};

export default GuidePage;
