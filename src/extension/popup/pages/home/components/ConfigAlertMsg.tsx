import { LaptopMinimalCheck, OctagonAlert } from "lucide-react";

type Prop = {
  type: "success" | "error";
  title: string;
  message: string;
};

const ConfigAlertMsg = (prop: Prop) => {
  return (
    <div
      role="alert"
      className={`alert alert-outline  ${
        prop.type === "error"
          ? "alert-error border-red-500"
          : "alert-success border-emerald-500"
      } alert-vertical sm:alert-horizontal rounded-lg`}
    >
      {prop.type === "error" ? (
        <OctagonAlert className="w-10 h-10 text-red-500" />
      ) : (
        <LaptopMinimalCheck className="w-10 h-10 text-emerald-500" />
      )}

      <div>
        <h3
          className={`text-lg font-bold mb-1 ${
            prop.type === "error" ? "text-red-500" : "text-emerald-400"
          }`}
        >
          {prop.title}
        </h3>
        <div className={`text-xs`}>{prop.message}</div>
      </div>
    </div>
  );
};

export default ConfigAlertMsg;
