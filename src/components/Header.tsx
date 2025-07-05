import logo from "../assets/articulate.png";
import { MoonStar, Sun } from "lucide-react";

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header = (props: Props) => {
  const { isDarkMode, toggleDarkMode } = props;

  return (
    <header className="w-full flex flex-col items-center justify-between h-auto px-3 py-2 bg-base-300 border border-b border-black/10 text-sm shadow">
      <div className="relative w-full flex items-center justify-center gap-3 pb-2">
        <img
          className={`shrink w-10 h-10 ${isDarkMode ? "invert-100" : ""}`}
          src={logo}
          alt="extension-logo"
        />
        <div className="shrink w-fit flex flex-col items-start justify-center">
          <h1 className="font-bold text-lg">Articulate</h1>
          <p className="font-semibold text-[10px]">
            Articulate your thoughts. Elevate your presence.
          </p>
        </div>
        <button
          className="absolute top-0 right-0 btn btn-xs btn-ghost btn-square"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <MoonStar className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
