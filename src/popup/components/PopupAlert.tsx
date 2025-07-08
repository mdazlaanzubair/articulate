import { Info, LoaderCircle, TriangleAlert } from "lucide-react";

type Props = {
  type: string;
  message: string;
};

const PopupAlert = (props: Props) => {
  if (props.type === "loading") {
    return (
      <div className="w-full h-auto flex items-center gap-2 px-3 py-1 bg-slate-300 text-slate-500 text-xs">
        <LoaderCircle className="animate-spin w-4" />
        {props.message}
      </div>
    );
  }
  if (props.type === "no-config") {
    return (
      <div className="w-full h-auto flex items-center gap-2 px-3 py-1 bg-red-100 text-red-500 text-xs">
        <TriangleAlert className="w-4" />
        {props.message}
      </div>
    );
  }
  if (props.type === "no-feed") {
    return (
      <div className="w-full h-auto flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs">
        <Info className="w-4" />
        {/* {props.message} */}
        <p>
          Kindly go to the{" "}
          <a
            href="http://www.linkedin.com/feed/"
            className="underline font-bold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Linkedin Feed
          </a>{" "}
          page.
        </p>
      </div>
    );
  }
};

export default PopupAlert;
