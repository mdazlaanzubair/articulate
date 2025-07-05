import {
  SELECT_TARGET,
  setupMutationObserver,
} from "../utils/helpers/selectorAPI";

// Injecting styles for articulate dropdown
const style = document.createElement("style");
style.textContent = `
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
  `;
document.head.appendChild(style);

// Initializing Observer
const feedContainer = document.querySelector(SELECT_TARGET.feeds);
if (!feedContainer || !(feedContainer instanceof HTMLElement)) {
  console.log("No Feed Found");
} else {
  setupMutationObserver(feedContainer);
}
