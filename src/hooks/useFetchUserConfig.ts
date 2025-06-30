import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { getAIConfigsByUser, type DBInterface } from "@/supabase/db_service";
import { saveToLocalStorage } from "@/helpers/localStorageHelpers";

/**
 * Hook to fetch and store the user's AI config after login
 */
export function useFetchUserConfig() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userConfig, setUserConfig] = useState<DBInterface | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const fetchConfig = async () => {
      try {
        const configs = await getAIConfigsByUser(user.id);

        if (configs.length > 0) {
          saveToLocalStorage<DBInterface>("user_config", configs[0]); // You can choose latest or prompt if multiple
          setUserConfig(configs[0]);
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
