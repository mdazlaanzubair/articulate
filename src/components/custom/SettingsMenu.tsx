import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeProvider";
import { BrainCircuit, Contrast, LogOut, Settings, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { SignedIn, useClerk, useUser } from "@clerk/clerk-react";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";

type Props = {};

export const SettingsMenu = () => {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="group cursor-pointer">
          <Settings className="h-5 w-5 group-hover:rotate-90 transition-all ease-in-out duration-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {/* ONLY SHOW WHEN SIGNED IN */}
        <SignedIn>
          {isLoaded ? (
            <DropdownMenuItem onClick={() => openUserProfile()}>
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden bg-primary">
                {user && user?.imageUrl ? (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={user?.imageUrl}
                    alt={user?.primaryEmailAddress?.emailAddress!}
                  />
                ) : (
                  <User2 className="h-3 w-3" />
                )}
              </div>
              My Profile
            </DropdownMenuItem>
          ) : (
            <MenuItemSkeleton type="profile" />
          )}

          <DropdownMenuSeparator className="opacity-35" />
          <DropdownMenuItem onClick={() => navigate("/setup")}>
            <BrainCircuit className="h-3 w-3" />
            AI Config
          </DropdownMenuItem>
          <DropdownMenuSeparator className="opacity-35" />
        </SignedIn>

        {/* SHOW TO EVERYONE */}
        <DropdownMenuItem asChild>
          <div
            onClick={(e) => e.stopPropagation()} // Prevent dropdown close
            className="w-full flex items-center justify-between px-2 py-1.5 cursor-default"
          >
            <div className="flex items-center gap-2">
              <Contrast className="h-3 w-3" />
              <span className="text-sm whitespace-nowrap">Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
            />
          </div>
        </DropdownMenuItem>

        {/* ONLY SHOW WHEN SIGNED IN */}
        <SignedIn>
          <DropdownMenuSeparator className="opacity-35" />
          {isLoaded ? (
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="h-3 w-3" />
              Logout
            </DropdownMenuItem>
          ) : (
            <MenuItemSkeleton type="default" />
          )}
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SkeletonType {
  type?: "default" | "profile";
}

const MenuItemSkeleton = (props: SkeletonType) => {
  if (props?.type === "profile") {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-[30px] w-[30px] rounded-full" />
        <Skeleton className="h-3 w-[100px] rounded-full" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-[100px] rounded-full" />
      </div>
    );
  }
};
