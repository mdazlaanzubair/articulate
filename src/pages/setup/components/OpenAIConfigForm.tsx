import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorageHelpers";
import { openai_models_list } from "./fromConstants";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUser } from "@clerk/clerk-react";
import {
  BadgeCheckIcon,
  Check,
  Copy,
  Eye,
  EyeClosed,
  LoaderCircle,
} from "lucide-react";
import { upsertAIConfig } from "@/supabase/db_service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const formSchema = z.object({
  user_id: z.string().min(8, "Please login before you continue"),
  openai_api_key: z
    .string()
    .min(8, "API Key is required and must be at least 8 characters."),
  model: z.string().min(1, "Select a model"),
});

export type FormData = z.infer<typeof formSchema>;

// A function to get initial values ---
// This runs once before the component renders.
const getInitialValues = (): FormData => {
  const userConfig = getFromLocalStorage<Partial<FormData>>("user_config");

  if (!userConfig) {
    return {
      user_id: "",
      openai_api_key: "",
      model: "",
    };
  }

  // Ensure the model from localStorage is still a valid choice
  const validModel = openai_models_list.find(
    (m) => m.slug === userConfig.model
  );

  return {
    user_id: "", // user_id will be set in useEffect
    openai_api_key: userConfig.openai_api_key || "",
    model: validModel ? validModel.slug : "", // Use the validated model slug
  };
};

export default function OpenAIConfigForm({
  activeProvider,
}: {
  activeProvider: string;
}) {
  // Initializing form reference with zod schema and default values
  const formRef = useForm<FormData>({
    mode: "onChange",
    shouldFocusError: true,
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  // Destructuring form reference
  const { control, handleSubmit, setValue, getValues } = formRef;

  // Initializing hooks
  const { isLoaded, user, isSignedIn } = useUser();

  // Initializing custom state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Performing side-effect of component mount or signed-in user change
  useEffect(() => {
    const userConfig = getFromLocalStorage<FormData>("user_config");

    // setting data to form value object
    if (userConfig) {
      const { model, openai_api_key } = userConfig;

      if (openai_api_key) {
        setValue("openai_api_key", openai_api_key ? openai_api_key : "");
      }

      if (model) {
        const validModel = openai_models_list.find((m) => m.slug === model);
        setValue("model", validModel ? validModel.slug : "");
      }
    }

    if (user) {
      setValue("user_id", user.id ? user.id : "");
    }

    console.log("Render from 1st useEffect:", getValues());
  }, [user]);

  // Handle submit + save to localStorage
  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        provider: activeProvider, // add provider manually
      };

      // Save config to Supabase
      const savedData = await upsertAIConfig(payload);

      // Persist to localStorage
      saveToLocalStorage("user_config", savedData);

      // Notify user
      toast.success("Configuration saved successfully.");
      console.log("✅ Supabase created config:", savedData);
    } catch (error) {
      console.error("Error fetching AI config:", error);
      toast.error("Failed to save config. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // function to copy api key to clipboard
  function copyToClipboard(text: string) {
    setIsCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <Form {...formRef}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        {/* User ID */}
        <FormField
          control={control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="hidden"
                  readOnly
                  placeholder="Enter your User ID"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional API Key field */}
        <FormField
          control={control}
          name="openai_api_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between gap-2">
                OpenAI API Key
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="flex items-center gap-1 hover:no-underline"
                  onClick={() => copyToClipboard(field.value)}
                >
                  {isCopied ? <Check /> : <Copy />}
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="Paste your OpenAI API key"
                    {...field}
                    className="pr-10" // add padding to prevent overlap with icon
                  />
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-auto w-auto bg-transparent shadow-none hover:bg-transparent"
                    aria-label="Toggle API key visibility"
                    title={showKey ? "Hide API key" : "Show API key"}
                  >
                    {showKey ? (
                      <EyeClosed className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model selection */}
        <FormField
          control={control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Model</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {openai_models_list.map((m) => (
                      <SelectItem
                        key={m.slug}
                        value={m.slug}
                        className="w-full flex items-center gap-2"
                      >
                        {m.title}
                        {m.isRecommended && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-500 text-white dark:bg-blue-600"
                          >
                            Recommended
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="default"
          type="submit"
          className="w-full flex items-center gap-2"
          disabled={!isLoaded || !isSignedIn}
        >
          {isLoading && <LoaderCircle className="animate-spin" />}
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
