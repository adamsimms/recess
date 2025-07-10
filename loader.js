(function () {
  const TENANT_NAME = 'recess';
  const scriptPaths = ['polyfills', 'js'];
  let hasInjected = false;

  function onAbonnementPage() {
    return window.location.pathname === "/abonnements";
  }

  function containerReady() {
    return document.querySelector('[data-mariana-integrations="/buy"]');
  }

  function inject() {
    if (hasInjected || !onAbonnementPage() || !containerReady()) return;

    console.log("✅ Injecting MarianaTek scripts...");
    hasInjected = true;

    // Remove old Mariana scripts (if any)
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => el.remove());

    // Inject fresh scripts
    scriptPaths.forEach(path => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });
  }

  // Set up a long-running SPA-aware watcher
  const monitor = () => {
    const check = () => {
      if (onAbonnementPage() && containerReady()) {
        inject();
      } else {
        hasInjected = false; // allow re-injection if user comes back
      }
    };

    // Check every 500ms for up to 60 seconds
    setInterval(check, 500);

    // Watch DOM changes as a backup
    new MutationObserver(check).observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Listen to Framer nav events
    window.addEventListener("popstate", check);
    window.addEventListener("framer-pageview", check);
  };

  console.log("🚀 Mariana loader loaded and watching for SPA route changes...");
  monitor();
})();
