import type { ToneType } from "../types";
import { articulateComment } from "./commentArticulator";

// Styles for dropdown that would be injected in the head of the webpage when `content-script.ts` loads
export const dropdownCSS = `
.ARTICULATE-dropdown {
  position: relative;
  display: inline-block;
}

/* === Toggle Button === */
.ARTICULATE-dropdown-trigger {
  width: 4rem;
  height: 4rem;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}
.ARTICULATE-dropdown-trigger:hover {
  background: rgba(24, 144, 255, 0.1);
}
.ARTICULATE-dropdown-trigger svg {
  width: 2.1rem;
  height: 2.1rem;
  color: #1890ff;
  transition: transform 0.2s ease;
}
.ARTICULATE-dropdown-trigger:focus svg,
.ARTICULATE-dropdown-trigger:hover svg {
  color: #1890ff;
}

/* === Menu Styles === */
.ARTICULATE-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  list-style: none;
  margin: 0;
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top right;
  transition: transform 0.2s ease, opacity 0.2s ease;
  z-index: 10000;
}
.ARTICULATE-dropdown-menu-show {
  opacity: 1;
  transform: scaleY(1);
}

/* === Menu Items === */
.ARTICULATE-dropdown-menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.ARTICULATE-dropdown-menu-item:hover {
  background: rgba(24, 144, 255, 0.1);
}
.ARTICULATE-dropdown-menu-item svg {
  width: 16px;
  height: 16px;
  color: #333333;
}
.ARTICULATE-dropdown-menu-item span {
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
}
.ARTICULATE-dropdown-menu-item:hover svg {
  color: #1890ff;
}
.ARTICULATE-dropdown-menu-item:hover span {
  color: #1890ff;
}

/* Apply it as a reusable class */
.ARTICULATE-spin {
  color: #333333;
  animation: ARTICULATE-spin 1s linear infinite;
}

/* Define the spin animation */
@keyframes ARTICULATE-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

  `;

// Currently supported tones
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

// Function to create a tone options dropdown to give user variety to articulate their comments
export function getArticulateDropdown(commentBox: Element): HTMLElement {
  const cssClassPrefix = "ARTICULATE-";

  // Dropdown open/close and loading statuses
  let isOpen = false;
  let isLoading = false;

  // 1) Root wrapper: replicates your <div class="dropdown">
  const wrapper = document.createElement("div");
  wrapper.className = cssClassPrefix + "dropdown";

  // 3) The toggle button (lightbulb)
  const toggle = document.createElement("button");
  toggle.setAttribute("type", "button");
  toggle.setAttribute("role", "button");
  toggle.setAttribute("title", "Articulate");
  toggle.className = cssClassPrefix + "dropdown-trigger";

  const toggleNormalIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb-icon lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
  const toggleLoaderIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ARTICULATE-spin lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

  // Injecting icon to the button
  toggle.innerHTML = toggleNormalIcon;

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
    menu_item.addEventListener("click", async () => {
      try {
        isLoading = true;

        // closing dropdown
        isOpen = !isOpen;
        menu.classList.toggle("ARTICULATE-dropdown-menu-show", isOpen);

        // changing btn UI
        toggle.disabled = true;
        toggle.innerHTML = toggleLoaderIcon;

        await articulateComment(commentBox, tone.slug as ToneType);
      } finally {
        isLoading = false;
        toggle.disabled = false;
        toggle.innerHTML = toggleNormalIcon;
      }
    });
    menu.appendChild(menu_item);
  });

  wrapper.appendChild(menu);

  // 6) Attaching event to toggle dropdown
  toggle.addEventListener("click", (event) => {
    if (isLoading) return; // block while loading
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
