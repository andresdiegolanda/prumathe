/* Runs in <head>, before the stylesheet, so the page paints in the chosen appearance from the first
   frame. The order is: ?theme= in the address, then the choice saved on this browser, then the
   system color scheme. site.js reads the result from <html data-theme>. */
(() => {
  const themes = ['light', 'dark'];
  let theme = null;
  try {
    theme = new URLSearchParams(location.search).get('theme');
  } catch {}
  if (!themes.includes(theme)) {
    try {
      theme = localStorage.getItem('prumathe-site-theme');
    } catch {}
  }
  if (!themes.includes(theme)) {
    theme =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
