(function () {
  const TENANT_NAME = "recess";
  const scriptPaths = ["polyfills", "js"];
  let hasInjected = false;

  function injectScripts() {
    if (hasInjected) return;

    const container = document.querySelector("[data-mariana-integrations]");
    if (!container) return;

    console.log("✅ Injecting MarianaTek scripts...");
    hasInjected = true;

    // Remove existing Mariana scripts
    document.querySelectorAll('script[src*="marianaiframes"]').forEach((el) => {
      console.log("♻️ Removing old script:", el.src);
      el.remove();
    });

    // Inject new scripts
    scriptPaths.forEach((path) => {
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

    // Optional: stop trying after 30s
    setTimeout(() => clearInterval(interval), 30000);

    // 🔁 Fallback in case polling doesn't trigger
    setTimeout(injectScripts, 1000);
  }

  // Load once on first page load
  console.log("🚀 Mariana loader active, watching for page + container...");
  watchForContainer();

  // On SPA navigation
  window.addEventListener("popstate", () => {
    hasInjected = false;
    watchForContainer();
  });

  window.addEventListener("framer-pageview", () => {
    hasInjected = false;
    watchForContainer();
  });
})();
