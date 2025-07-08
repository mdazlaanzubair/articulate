import logo from "../../assets/articulate-icon.png";
import { MoonStar, Sun } from "lucide-react";

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header = (props: Props) => {
  const { isDarkMode, toggleDarkMode } = props;

  return (
    <header className="w-full flex flex-col items-center justify-between h-auto bg-base-100 border border-b border-black/10 text-sm shadow">
      <div className="relative w-full flex items-center justify-center">
        <img
          className={`shrink w-14 h-auto rounded ${
            isDarkMode ? "shadow-sm border border-black/10 m-3" : "my-3"
          }`}
          src={logo}
          alt="extension-logo"
        />
        <div className="shrink w-fit flex flex-col items-start justify-center">
          <h1
            className="font-bold text-4xl pacifico-regular lowercase"
            title="Articulate"
          >
            Articulate
          </h1>
          <p className="font-normal text-[9px]">
            Articulate thoughts. Elevate presence.
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
