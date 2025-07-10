(function () {
  const TENANT_NAME = 'recess';
  const scriptPaths = ['polyfills', 'js'];
  let injected = false;

  function inject() {
    if (injected) return;
    if (window.location.pathname !== "/abonnements") return;

    // If the container doesn't exist, create it
    let container = document.querySelector('[data-mariana-integrations="/buy"]');
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("data-mariana-integrations", "/buy");
      container.style.width = "100%";
      container.style.minHeight = "500px";

      // Append it to a known wrapper (like main or body)
      const target = document.querySelector("main") || document.body;
      if (target) {
        target.appendChild(container);
        console.log("✅ Dynamically added Mariana container");
      } else {
        console.warn("❌ Could not find where to place Mariana container");
        return;
      }
    }

    // Remove previous scripts (if any)
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => el.remove());

    // Inject fresh scripts
    scriptPaths.forEach(path => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed to load: ${script.src}`);
      document.body.appendChild(script);
    });

    injected = true;
    console.log("✅ MarianaTek fully injected");
  }

  const monitor = () => {
    inject();
    const observer = new MutationObserver(inject);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", inject);
    window.addEventListener("framer-pageview", inject);
  };

  setTimeout(monitor, 500);
})();
