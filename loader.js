(function () {
  const TENANT_NAME = 'recess';
  const scriptPaths = ['polyfills', 'js'];
  let injected = false;

  function inject() {
    const container = document.querySelector('[data-mariana-integrations="/buy"]');
    if (!container) return;

    // Remove any previous iframe
    const oldIframe = container.querySelector('iframe');
    if (oldIframe) {
      console.log("♻️ Removing old iframe...");
      oldIframe.remove();
    }

    // Remove previous scripts
    document.querySelectorAll('script[src*="marianaiframes"]').forEach(el => {
      console.log("♻️ Removing old script:", el.src);
      el.remove();
    });

    // Inject fresh scripts
    scriptPaths.forEach(path => {
      const script = document.createElement("script");
      script.src = `https://${TENANT_NAME}.marianaiframes.com/${path}`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.onload = () => console.log(`✅ Loaded: ${script.src}`);
      script.onerror = () => console.error(`❌ Failed: ${script.src}`);
      document.body.appendChild(script);
    });

    injected = true;
    console.log("✅ MarianaTek injected");
  }

  // Check every 500ms whether the container has appeared
  const checkAndInject = () => {
    const container = document.querySelector('[data-mariana-integrations="/buy"]');

    if (container && !container.querySelector('iframe')) {
      inject();
    }
  };

  // Initial check
  setTimeout(checkAndInject, 500);

  // Keep checking every half second (for SPA nav)
  const interval = setInterval(checkAndInject, 500);

  // Optional: stop checking after 30 seconds
  setTimeout(() => clearInterval(interval), 30000);
})();
