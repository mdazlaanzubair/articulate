import type { JSX } from "react";

// Interface for page object
export interface PageInterface {
  title: string;
  slug: string;
  element: JSX.Element;
}

// Interface for alert object
export interface AlertInterface {
  type: "info" | "success" | "warning" | "error";
  show: boolean;
  title: string;
  message: string;
}

// Interface for AI config form fields
export interface FormInterface {
  provider: string;
  api_key: string;
  model: string;
}

export interface UserConfigInterface {
  provider: string;
  api_key: string;
  model: string;
}

// Interface for post context object
export interface PostContextInterface {
  tone: ToneType;
  author: string | null;
  post: string | null;
  user_comment: string | null;
}

// Interface for post content validation
export interface PostContentValidation {
  isError: boolean;
  error_msg: string | null;
}

// Interface for post content validation
export interface DynamicPromptInterface extends PostContentValidation {
  prompt: string | null;
}

// Interface for AI functions params
export interface AIParamsInterface extends UserConfigInterface {
  prompt: string;
}

// Interface for Chrome Messages coming from `background-script`
export interface ContentScriptMessage {
  type: "INIT_USER_CONFIG" | "USER_CONFIG_UPDATED";
  payload: UserConfigInterface;
}

// Interface for dropdown options
export interface ToneOption {
  title: string;
  slug: ToneType;
  svg: string;
}

// Interface for AI models list
export interface AIModelInterface {
  title: string;
  slug: string;
}

// Type face for tones
export type ToneType =
  | "professional"
  | "concise"
  | "funny"
  | "friendly"
  | "proofread";
