import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { getAIConfigsByUser, type DBInterface } from "@/supabase/db_service";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorageHelpers";

/**
 * Hook to fetch and store the user's AI config after login.
 * If a valid config exists in localStorage, it avoids calling Supabase.
 */
export function useFetchUserConfig() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [userConfig, setUserConfig] = useState<DBInterface | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const fetchConfig = async () => {
      // 1. Check localStorage first
      const localConfig = getFromLocalStorage<DBInterface>("user_config");

      // 2. If valid config exists, use it and skip fetching
      if (localConfig?.user_id === user.id) {
        setUserConfig(localConfig);
        setIsLoading(false);
        return;
      }

      // 3. Else, fetch from Supabase
      try {
        const configs = await getAIConfigsByUser(user.id);

        if (configs.length > 0) {
          const config = configs[0];
          saveToLocalStorage("user_config", config);
          setUserConfig(config);
          toast.success("AI Configuration loaded successfully.");
        } else {
          saveToLocalStorage("user_config", null);
          toast.info("AI Provider Not Configured", {
            action: {
              label: "Goto AI Config",
              onClick: () => navigate("/setup"),
            },
          });
        }
      } catch (error) {
        console.error("Error fetching AI config:", error);
        toast.error("Failed to load AI config. Please try again.");
        saveToLocalStorage("user_config", null);
        navigate("/setup");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [isSignedIn, user, navigate]);

  return { isLoading, userConfig };
}
