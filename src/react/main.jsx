import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CookieBanner } from "./CookieBanner.jsx";

const el = document.getElementById("geo-cookie-root");
if (el) {
  createRoot(el).render(
    <StrictMode>
      <CookieBanner />
    </StrictMode>,
  );
}
