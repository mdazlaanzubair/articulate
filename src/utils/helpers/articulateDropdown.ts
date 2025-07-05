import type { ToneType } from "../types";
import { articulateComment } from "./commentArticulator";

// Function to create a tone options dropdown to give user variety to articulate their comments
const options = [
  {
    title: "Professional Tone",
    slug: "professional",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-business-icon lucide-briefcase-business"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
  },
  {
    title: "Concise",
    slug: "concise",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-icon lucide-text"><path d="M15 18H3"/><path d="M17 6H3"/><path d="M21 12H3"/></svg>`,
  },
  {
    title: "Funny Tone",
    slug: "funny",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laugh-icon lucide-laugh"><circle cx="12" cy="12" r="10"/><path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`,
  },
  {
    title: "Friendly Tone",
    slug: "friendly",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake-icon lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
  },
  {
    title: "Proofread",
    slug: "proofread",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-search-icon lucide-text-search"><path d="M21 6H3"/><path d="M10 12H3"/><path d="M10 18H3"/><circle cx="17" cy="15" r="3"/><path d="m21 19-1.9-1.9"/></svg>`,
  },
];

export function getArticulateDropdown(commentBox: Element): HTMLElement {
  const cssClassPrefix = "ARTICULATE-";

  // 1) Root wrapper: replicates your <div class="dropdown">
  const wrapper = document.createElement("div");
  wrapper.className = cssClassPrefix + "dropdown";

  // 3) The toggle button (lightbulb)
  const toggle = document.createElement("button");
  toggle.setAttribute("type", "button");
  toggle.setAttribute("role", "button");
  toggle.setAttribute("title", "Articulate");
  toggle.className = cssClassPrefix + "dropdown-trigger";

  // Injecting icon to the button
  toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb-icon lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;

  // Appending it in the wrapper
  wrapper.appendChild(toggle);

  // 4) The dropdown menu
  const menu = document.createElement("div");
  menu.className = cssClassPrefix + "dropdown-menu";

  // 5) Populate menu items
  options.forEach((tone) => {
    const menu_item = document.createElement("div");
    menu_item.className = cssClassPrefix + "dropdown-menu-item";
    menu_item.innerHTML = tone.svg + `<span>${tone.title}</span>`;

    // attaching function to generate comment
    menu_item.addEventListener("click", () => {
      articulateComment(commentBox, tone.slug as ToneType);
    });
    menu.appendChild(menu_item);
  });

  wrapper.appendChild(menu);

  // 6) Attaching event to toggle dropdown
  let isOpen = false;
  toggle.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent bubbling to document
    isOpen = !isOpen;
    menu.classList.toggle("ARTICULATE-dropdown-menu-show", isOpen);
  });

  // Event attaching to see if the click happened in the
  // document close thr dropdown if its already opened
  document.addEventListener("click", (e) => {
    if (isOpen && !wrapper.contains(e.target as Node)) {
      isOpen = false;
      menu.classList.remove(`${cssClassPrefix}dropdown-menu-show`);
    }
  });
  return wrapper;
}
