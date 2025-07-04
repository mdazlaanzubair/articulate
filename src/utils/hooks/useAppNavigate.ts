import { useState } from "react";
import type { PageInterface } from "../types";
import { appPages } from "../../extension/popup/pages";

export const useAppNavigate = () => {
  // 1. Initialize with the first page as the default.
  const [currentPage, setCurrentPage] = useState<PageInterface>(appPages[0]);

  // Function to mimic page navigation.
  const pageSwitcher = (requiredPage: string) => {
    // 2. Use `find` to get the first matching page or undefined.
    const foundPage = appPages.find((page) => page.slug === requiredPage);
    // Set the found page, or fall back to the first page if not found.
    setCurrentPage(foundPage || appPages[0]);
  };

  // 3. Return as a const tuple for better type inference and safety.
  return [currentPage, pageSwitcher] as const;
};
