(function () {
  const TENANT_NAME = 'recess';
  const scriptPaths = ['polyfills', 'js'];
  let hasInjected = false;

  function containerExists() {
    const container = document.querySelector('[data-mariana-integrations="/buy"]');
    return container && window.location.pathname === "/abonnements";
  }

  function injectScripts() {
    if (hasInjected || !containerExists()) return;

    console.log("✅ Injecting MarianaTek scripts...");
    hasInjected = true;

    // Remove old scripts
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => el.remove());

    // Inject scripts
    scriptPaths.forEach(path => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });
  }

  function resetAndCheck() {
    hasInjected = false; // Allow re-injection
    const retry = setInterval(() => {
      if (containerExists()) {
        injectScripts();
        clearInterval(retry);
      }
    }, 300);
  }

  // Initial
  resetAndCheck();

  // Re-run on route changes
  window.addEventListener("popstate", resetAndCheck);
  window.addEventListener("framer-pageview", resetAndCheck);

  // MutationObserver for extra safety (SPA nav)
  new MutationObserver(resetAndCheck).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
