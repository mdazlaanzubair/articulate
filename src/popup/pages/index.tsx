import type { PageInterface } from "../../utils/types";
import GuidePage from "./guide";
import HomePage from "./home";
import SetupPage from "./setup";

export const appPages: PageInterface[] = [
  {
    title: "Home",
    slug: "home-page",
    element: <HomePage />,
  },
  {
    title: "Guide",
    slug: "guide-page",
    element: <GuidePage />,
  },
  {
    title: "Setup",
    slug: "setup-page",
    element: <SetupPage />,
  },
];

export { HomePage, GuidePage, SetupPage };
