export type Theme = "dark" | "light";

/**
 * Theme a first-time reader gets. "system" follows the OS setting. A reader's
 * own choice, once made with the toggle, is kept in localStorage and wins.
 */
export const DEFAULT_THEME: Theme | "system" = "dark";

export const THEME_KEY = "ffd-theme";

/** Class the static HTML ships with, before the script below has run. */
export const STATIC_THEME_CLASS = DEFAULT_THEME === "dark" ? "dark" : "";

/**
 * Runs in <head> while the HTML is still being parsed, so the right palette
 * is in place before the first paint. The exported HTML is the same file for
 * every reader; only this script knows what they picked.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t!=="dark"&&t!=="light"){t=${JSON.stringify(DEFAULT_THEME)};if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;
