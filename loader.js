(function () {
  const TENANT_NAME = 'recess';
  const scriptPaths = ['polyfills', 'js'];
  let hasInjected = false;

  function inject() {
    const container = document.querySelector('[data-mariana-integrations="/buy"]');
    const existingIframe = container?.querySelector("iframe");

    if (!container) return;
    if (hasInjected && existingIframe) return; // Already loaded

    console.log("✅ Injecting MarianaTek scripts...");
    hasInjected = true;

    // Clean up
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => el.remove());

    scriptPaths.forEach((path) => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });
  }

  // Run immediately
  inject();

  // Re-run every 500ms (but only injects once per session)
  setInterval(inject, 500);
})();
