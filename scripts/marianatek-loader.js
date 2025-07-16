(function () {
  const TENANT_NAME = "recess";
  const scriptPaths = ["polyfills", "js"];
  let hasInjected = false;

  function injectScripts() {
    if (hasInjected) return;

    const container = document.querySelector("[data-mariana-integrations]");
    if (!container) return;

    console.log("✅ Injecting MarianaTek scripts for:", container.getAttribute("data-mariana-integrations"));
    hasInjected = true;

    // Remove any previously injected Mariana scripts
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => {
      console.log("♻️ Removing old script:", el.src);
      el.remove();
    });

    // Inject updated scripts
    scriptPaths.forEach(path => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });
  }

  function watchForContainer() {
    const interval = setInterval(() => {
      const containerExists = document.querySelector("[data-mariana-integrations]");
      if (containerExists) {
        clearInterval(interval);
        injectScripts();
      }
    }, 300);

    // Stop polling after 30 seconds
    setTimeout(() => clearInterval(interval), 30000);
  }

  // Initial load
  console.log("🚀 Mariana loader active, watching for data-mariana-integrations container...");
  watchForContainer();

  // Recheck on SPA navigations
  window.addEventListener("popstate", () => {
    hasInjected = false;
    watchForContainer();
  });

  window.addEventListener("framer-pageview", () => {
    hasInjected = false;
    watchForContainer();
  });
})();
