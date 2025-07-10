(function () {
  const TENANT_NAME = 'recess';
  const scriptPaths = ['polyfills', 'js'];
  let lastInjectedPath = "";

  function inject() {
    const path = window.location.pathname;
    const container = document.querySelector('[data-mariana-integrations="/buy"]');

    if (path !== "/abonnements") return;
    if (!container) return;
    if (container.querySelector("iframe")) return; // already loaded
    if (lastInjectedPath === path) return;

    console.log("✅ Injecting MarianaTek for:", path);
    lastInjectedPath = path;

    // Remove old Mariana scripts
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => {
      console.log("♻️ Removing old script:", el.src);
      el.remove();
    });

    // Inject new scripts
    scriptPaths.forEach(path => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });
  }

  // Listen to navigation events
  const runWatcher = () => {
    inject();
    const observer = new MutationObserver(() => inject());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("popstate", inject);
    window.addEventListener("framer-pageview", inject);
  };

  // Delay start to ensure Framer has mounted
  setTimeout(runWatcher, 500);
})();
