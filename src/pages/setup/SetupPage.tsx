import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeminiAIConfigForm from "./components/GeminiAIConfigForm";
import OpenAIConfigForm from "./components/OpenAIConfigForm";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/helpers/localStorageHelpers";

interface ProviderInterface {
  provider: "gemini" | "openai";
}

export const SetupPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"gemini" | "openai">("gemini");

  useEffect(() => {
    const userConfig = getFromLocalStorage<ProviderInterface>("user_config");
    if (userConfig?.provider) setActiveTab(userConfig.provider);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between border-b pb-3 mb-2 border-primary/5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Setup your AI provider
        </h3>
        <Button
          variant="secondary"
          size="sm"
          className="w-fit text-xs m-0 self-end"
          onClick={() => navigate("/guide")}
        >
          <Info className="w-3 h-3" />
          Help
        </Button>
      </div>
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "gemini" | "openai")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
          <TabsTrigger value="openai">OpenAI GPT</TabsTrigger>
        </TabsList>
        <TabsContent value="gemini">
          <GeminiAIConfigForm activeProvider="gemini" />
        </TabsContent>
        <TabsContent value="openai">
          <OpenAIConfigForm activeProvider="openai" />
        </TabsContent>
      </Tabs>
    </>
  );
};
