import { useEffect, useState } from "react";
import Alert from "./components/Alert";
import type {
  AIModelInterface,
  AlertInterface,
  FormInterface,
} from "../../../utils/types";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  getStoredData,
  setStoredData,
} from "../../../utils/helpers/storageAPI";
import {
  validateAPIKeyAndFetchModelsOpenAI,
  validateAPIKeyAndFetchModelsGemini,
} from "../../../utils/helpers/aiAPIKeyValidator";

const SetupPage = () => {
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertInterface | null>();
  const [AIModelsList, setAIModelsList] = useState<AIModelInterface[]>([]);
  const [formData, setFormData] = useState<FormInterface>({
    provider: "",
    model: "",
    api_key: "",
  });

  // Performing side-effect on component mount and get data from local storage (if exist)
  useEffect(() => {
    (async () => {
      const userConfig = await getStoredData("user_config");
      if (userConfig) {
        setFormData(userConfig);
      }
      console.log("User Config");
      console.log(userConfig);
    })();
  }, []);

  // Performing side effect on form field change and fetch models accordingly
  useEffect(() => {
    const validateAPIKey = async () => {
      // return if input is empty
      if (formData.api_key.length <= 0) return;

      if (formData.provider === "openai") {
        try {
          setIsLoadingModels(true);
          setAlert(null);

          const modelsList = await validateAPIKeyAndFetchModelsOpenAI(
            formData.api_key
          );
          setAIModelsList(modelsList);
        } catch (e: any) {
          console.error("OpenAI validation failed:", e);
          setAlert({
            type: "error",
            title: "Validation Error!",
            message: "Please enter a valid OpenAI API key.",
            show: true,
          });
        } finally {
          setIsLoadingModels(false);
        }
      } else if (formData.provider === "gemini") {
        try {
          setIsLoadingModels(true);
          setAlert(null);

          const modelsList = await validateAPIKeyAndFetchModelsGemini(
            formData.api_key
          );
          setAIModelsList(modelsList);
        } catch (e: any) {
          console.error("Gemini validation failed:", e);
          setAlert({
            type: "error",
            title: "Validation Error!",
            message: "Please enter a valid Gemini API key.",
            show: true,
          });
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        setAlert({
          type: "error",
          title: "Invalid Provider!",
          message: "Please select a valid provider.",
          show: true,
        });
      }
    };

    validateAPIKey();
  }, [formData.api_key, formData.provider]);

  // function to submit form
  const submitHandler = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      // validating form
      const error = await validateFormData(formData);
      if (error) {
        setAlert(error);
        // scroll for element having id="alert"
        const alertBox = document.getElementById("alert");
        if (alertBox) alertBox.scrollIntoView({ behavior: "smooth" });
        return;
      }

      // resetting errors state
      setAlert(null);

      // saving in the local storage
      const success = await setStoredData("user_config", formData);

      // showing success
      if (success) {
        setAlert({
          type: "success",
          title: "Configuration Successful!",
          message: "Your configuration has been saved successfully.",
          show: true,
        });

        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error!",
        message: "Something went wrong. Please try again later.",
        show: true,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to validate form data
  const validateFormData = async (
    data: FormInterface
  ): Promise<AlertInterface | null> => {
    // Validate if the provider is selected
    if (data.provider.length <= 0) {
      return {
        type: "error",
        title: "Provider Not Selected!",
        message: "Please select a provider.",
        show: true,
      };
    }

    // Validate if the provider is one of those which are in the select-box
    if (data.provider !== "openai" && data.provider !== "gemini") {
      return {
        type: "error",
        title: "Invalid Provider!",
        message: "Please select a valid provider.",
        show: true,
      };
    }

    // Validate if API Key is present
    if (data.api_key.length <= 0) {
      return {
        type: "error",
        title: "API Key Not Found!",
        message: "Please enter your API key.",
        show: true,
      };
    }

    if (AIModelsList.length > 0 && data.model.length <= 0) {
      return {
        type: "error",
        title: "Model Not Selected!",
        message: "Please select a model.",
        show: true,
      };
    }

    return null;
  };

  return (
    <section className="w-full h-full flex flex-col gap-3 overflow-x-hidden overflow-y-auto px-5 py-2">
      <header>
        <h1 className="text-xl font-bold mb-2">Configure your AI</h1>
        <p className="text-xs">
          All your data will be stored securely in your browser on your device.
          Rest assured, no data is shared with us.
        </p>
        {alert && alert.show && (
          <Alert
            show={alert.show}
            type={alert.type}
            title={alert.title}
            message={alert.message}
          />
        )}
      </header>

      <form onSubmit={submitHandler}>
        {/* Provider selection field */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Choose AI Provider</legend>
          <select
            className="select select-sm focus:outline-0"
            disabled={isLoading || isLoadingModels}
            defaultValue={"Pick a provider"}
            value={formData.provider && formData.provider}
            onChange={(e) => {
              setFormData({ ...formData, provider: e.target.value });
            }}
          >
            <option value="none">Pick a provider </option>
            <option value="gemini">Google</option>
            <option value="openai">OpenAI</option>
          </select>
        </fieldset>

        {/* API Key text input field */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">API Key</legend>
          <div className="flex items-center justify-between gap-2">
            <input
              disabled={isLoading || isLoadingModels}
              type={show ? "text" : "password"}
              defaultValue={formData?.api_key ? formData?.api_key : ""}
              onBlur={(e) =>
                setFormData({ ...formData, api_key: e.target.value })
              }
              className="input input-sm focus:outline-0"
              placeholder="Type here"
            />
            <button
              type="button"
              title="Toggle API Key Visibility"
              className={`btn btn-sm btn-square btn-neutral ${
                show ? "btn-soft" : ""
              }`}
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? <Eye className="w-4" /> : <EyeOff className="w-4" />}
            </button>
          </div>
          <p className="label text-[10px] break-words">
            Your API key will be stored in your browser only.
          </p>
        </fieldset>

        {/* Model selection field */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Select AI Model</legend>
          <select
            defaultValue="Pick an AI Model"
            value={formData.model && formData.model}
            className="select select-sm focus:outline-0"
            disabled={AIModelsList.length <= 0 || isLoading || isLoadingModels}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          >
            <option value="none">Pick an AI Model </option>
            {AIModelsList.length > 0 &&
              AIModelsList.map((model) => (
                <option key={model.slug} value={model.slug}>
                  {model.title}
                </option>
              ))}
          </select>
        </fieldset>

        <button
          type="submit"
          disabled={isLoading || isLoadingModels || AIModelsList.length <= 0}
          className="relative btn btn-primary btn-sm w-full mt-4 rounded overflow-hidden"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="absolute top-1/2 left-3 -translate-y-1/2 animate-spin w-4 mr-2" />
              Loading...
            </>
          ) : isLoadingModels ? (
            <>
              <LoaderCircle className="absolute top-1/2 left-3 -translate-y-1/2 animate-spin w-4 mr-2" />
              Fetching available models...
            </>
          ) : (
            "Save"
          )}
        </button>
      </form>
    </section>
  );
};

export default SetupPage;
