import { Feather } from "lucide-react";
import { SettingsMenu } from "./SettingsMenu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full h-auto flex items-center justify-between gap-3 border-b px-5 py-3">
      <div
        className="grow flex items-center justify-start gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="bg-primary text-primary-foreground rounded-full p-2">
          <Feather className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Articulate
          </h4>
          <small className="text-[.65rem] leading-none font-medium opacity-50">
            Articulate your thoughts. Elevate your presence.
          </small>
        </div>
      </div>

      {/* ACTION CONTROL CENTER */}
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default" size="default">
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SettingsMenu />
        </SignedIn>
      </div>
    </header>
  );
};
