import { BadgeCheck, OctagonAlert } from "lucide-react";

type Props = {
  type?: "info" | "success" | "warning" | "error";
  show: boolean;
  title: string;
  message: string;
};

const Alert = ({ show, type, title, message }: Props) => {
  if (show && type === "error") {
    return (
      <div
        id="alert"
        role="alert"
        className={`w-full flex items-center justify-between gap-3 text-error border border-red-500 mt-2 p-2 rounded-md`}
      >
        <OctagonAlert className="w-6 h-6 text-red-500" />
        <div className="grow flex flex-col items-start justify-center">
          <h3 className="font-bold text-sm text-red-500">{title}</h3>
          <div className="text-xs">{message}</div>
        </div>
      </div>
    );
  } else if (show && type === "success") {
    return (
      <div
        id="alert"
        role="alert"
        className={`w-full flex items-center justify-between gap-3 text-success border border-emerald-400 mt-2 p-2 rounded-md`}
      >
        <BadgeCheck className="w-6 h-6 text-emerald-400" />
        <div className="grow flex flex-col items-start justify-center">
          <h3 className="font-bold text-sm text-emerald-400">{title}</h3>
          <div className="text-xs">{message}</div>
        </div>
      </div>
    );
  }
};

export default Alert;
