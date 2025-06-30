import { Button } from "@/components/ui/button";
import { useFetchUserConfig } from "@/hooks/useFetchUserConfig";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import {
  Feather,
  LoaderCircle,
  LogIn,
  Settings,
  Signature,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { isLoading, userConfig } = useFetchUserConfig();

  return (
    <div className="w-full h-auto flex flex-col justify-center items-start">
      <div className="max-w-xl">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Welcome to <span className="text-primary">Articulink</span> ✨
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Effortlessly generate smart, polished comments for LinkedIn posts
          using AI.
        </p>

        <ul className="text-left list-disc list-inside text-sm space-y-2 mx-3 mt-3 mb-6">
          <li>Understands the LinkedIn post you're replying to</li>
          <li>
            Offers tone choices like Friendly, Professional, Concise, etc.
          </li>
          <li>Generates high-quality comments using GPT or Gemini</li>
        </ul>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <SignedIn>
            <Button
              variant={isLoading || !userConfig ? "secondary" : "default"}
              size="lg"
              disabled={isLoading || !userConfig}
              onClick={() => navigate("/setup")}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Feather />
              )}
              Get Started
            </Button>
            <Button
              variant={isLoading || !userConfig ? "default" : "secondary"}
              size="lg"
              onClick={() => navigate("/setup")}
            >
              <Settings />
              AI Config
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" size="default">
                <LogIn />
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="ghost" size="default">
                <Signature />
                Register
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
