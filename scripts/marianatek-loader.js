(function () {
  const TENANT_NAME = "recess";
  const scriptPaths = ["polyfills", "js"];
  let hasInjected = false;

  function injectScripts() {
    if (hasInjected) return;

    console.log("📦 Container found, injecting Mariana scripts...");
    hasInjected = true;

    // Remove old scripts if any
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => {
      console.log("♻️ Removing old script:", el.src);
      el.remove();
    });

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
      const container = document.querySelector("[data-mariana-integrations]");

      if (container) {
        clearInterval(interval);
        injectScripts();
      }
    }, 300);

    setTimeout(() => clearInterval(interval), 30000);
  }

  console.log("🚀 Mariana loader active, watching for page + container...");
  watchForContainer();

  window.addEventListener("popstate", () => {
    hasInjected = false;
    watchForContainer();
  });

  window.addEventListener("framer-pageview", () => {
    hasInjected = false;
    watchForContainer();
  });
})();
