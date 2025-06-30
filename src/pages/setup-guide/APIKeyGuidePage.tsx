import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContent } from "./components";

export const APIKeyGuidePage = () => {
  return (
    <div className="font-inter antialiased">
      <Tabs defaultValue="gemini" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
          <TabsTrigger value="openai">OpenAI GPT</TabsTrigger>
        </TabsList>
        <TabsContent value="gemini">
          <TabContent provider="gemini" />
        </TabsContent>
        <TabsContent value="openai">
          <TabContent provider="openai" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
