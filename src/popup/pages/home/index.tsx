const HomePage = () => {
  // Function to redirect url on linkedin page
  const handleGetStartedClick = async () => {
    const linkedInUrl = "https://www.linkedin.com/feed/";

    // Use Chrome API to search for existing LinkedIn tabs
    const existingTabs = await chrome.tabs.query({ url: linkedInUrl + "*" });

    if (existingTabs.length > 0) {
      // If an existing LinkedIn tab is found, switch to it
      await chrome.tabs.update(existingTabs[0].id!, { active: true });
    } else {
      // If no existing LinkedIn tab is found, create a new one
      await chrome.tabs.create({ url: linkedInUrl });
    }
  };

  return (
    <section className="w-full h-full flex flex-col gap-8 overflow-x-hidden overflow-y-auto p-5">
      <div>
        <h1 className="text-xl font-bold mb-1">Welcome to Articulate!</h1>
        <p className="text-xs mb-3">
          Use AI to articulate your thoughts into structured language.
          Articulate
        </p>
        <button
          type="button"
          className="btn btn-sm w-full bg-blue-600 hover:bg-blue-700 text-slate-50 hover:text-white rounded"
          onClick={handleGetStartedClick}
        >
          Let&apos;s Articulate
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-base font-semibold">How to use articulate</h1>
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/OB99"
            title="How to use articulate?"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
