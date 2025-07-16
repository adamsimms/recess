(function () {
  const TENANT_NAME = "recess";
  const scriptPaths = ["polyfills", "js"];
  let hasInjected = false;

  function injectScripts() {
    if (hasInjected) return;

    const container = document.querySelector("[data-mariana-integrations]");
    if (!container) {
      console.log("⏳ Still no container, skipping injection...");
      return;
    }

    console.log("✅ Injecting MarianaTek scripts...");
    hasInjected = true;

    // Remove old versions
    document.querySelectorAll('script[src*="marianaiframes"]').forEach((el) => {
      console.log("♻️ Removing old script:", el.src);
      el.remove();
    });

    // Inject new versions
    scriptPaths.forEach((path) => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });
  }

  function startWatching() {
    // Recheck every 500ms
    const interval = setInterval(() => {
      const container = document.querySelector("[data-mariana-integrations]");
      if (container) {
        console.log("👀 Container found, proceeding...");
        clearInterval(interval);
        injectScripts();
      }
    }, 500);

    // Also try once after 2s, just in case
    setTimeout(() => {
      console.log("⏱ Fallback injection after timeout...");
      injectScripts();
      clearInterval(interval);
    }, 2000);
  }

  console.log("🚀 Mariana loader active. Waiting for container...");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWatching);
  } else {
    startWatching();
  }

  window.addEventListener("popstate", () => {
    hasInjected = false;
    startWatching();
  });

  window.addEventListener("framer-pageview", () => {
    hasInjected = false;
    startWatching();
  });
})();
