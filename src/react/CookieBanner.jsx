import { useCallback, useEffect, useState } from "react";

const CONSENT_KEY = "geo-cookie-consent";

function getI18n() {
  return typeof window !== "undefined" ? window.GEO_I18N : null;
}

/** Банер за съгласие с бисквитки — преди беше статичен HTML + `initCookieBanner` в `script.js`. */
export function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(CONSENT_KEY) === "1";
    } catch {
      return true;
    }
  });
  const [, bump] = useState(0);
  const refreshCopy = useCallback(() => bump((n) => n + 1), []);

  useEffect(() => {
    const onLang = () => refreshCopy();
    window.addEventListener("geo-lang-change", onLang);
    return () => window.removeEventListener("geo-lang-change", onLang);
  }, [refreshCopy]);

  const i18n = getI18n();
  const ariaLabel = i18n?.t?.("cookie_aria") ?? "Cookie notice";
  const bodyHtml = i18n?.t?.("cookie_text_html") ?? "";
  const okLabel = i18n?.t?.("cookie_ok") ?? "OK";

  const onAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "1");
    } catch {
      /* storage blocked */
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label={ariaLabel}>
      <p dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <button type="button" className="button primary cookie-accept" onClick={onAccept}>
        {okLabel}
      </button>
    </div>
  );
}
