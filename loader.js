(function () {
  const TENANT_NAME = 'recess';
  const scriptPaths = ['polyfills', 'js'];
  let attempts = 0;
  const maxAttempts = 150;

  function injectMarianaTek() {
    console.log("🚀 MarianaTek external loader started");

    const container = document.querySelector('[data-mariana-integrations="/buy"]');
    if (!container) {
      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(injectMarianaTek, 100);
      } else {
        console.warn("❌ MarianaTek container not found after 15s");
      }
      return;
    }

    console.log("✅ MarianaTek container found. Injecting scripts...");

    // Remove previous iframe
    const oldIframe = container.querySelector("iframe");
    if (oldIframe) oldIframe.remove();

    // Remove existing scripts
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => el.remove());

    // Inject scripts
    scriptPaths.forEach(path => {
      const script = document.createElement('script');
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute('data-timestamp', Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });
  }

  injectMarianaTek();
  window.addEventListener("popstate", injectMarianaTek);
  window.addEventListener("framer-pageview", injectMarianaTek);
})();
