/**
 * Tiny bridge between the preloader and whatever waits for it (the hero
 * entrance). The preloader calls markPreloaderDone(); anything else calls
 * onPreloaderDone(cb), which runs at once if the preloader already finished
 * or was skipped (second visit in the session, or no JS overlay at all).
 */
const EVENT = "preloader:done";
export const PRELOADER_SESSION_KEY = "if-preloaded";

declare global {
  interface Window {
    __preloaderDone?: boolean;
  }
}

export function markPreloaderDone() {
  if (typeof window === "undefined") return;
  window.__preloaderDone = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onPreloaderDone(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const skipped = document.documentElement.classList.contains("pl-skip");
  if (window.__preloaderDone || skipped) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}

/**
 * Runs before first paint (inlined in <head>):
 * - marks that JS is on (`js`), so reveal-on-load styles apply only then;
 * - skips the preloader on later page loads in the same tab session.
 */
export const PRELOADER_BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('${PRELOADER_SESSION_KEY}')){d.classList.add('pl-skip')}else{d.classList.add('pl-active')}}catch(e){d.classList.add('pl-skip')}})();`;
