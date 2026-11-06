import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { reportClientError } from "./lib/reportClientError";
import "./styles/index.css";

if (import.meta.env.DEV) {
  window.addEventListener("error", (event) => {
    reportClientError({
      source: "window.error",
      message: String(event.message || "unknown error"),
      stack: event.error instanceof Error ? event.error.stack : undefined,
    });
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason as { message?: string; stack?: string } | string;
    reportClientError({
      source: "unhandledrejection",
      message: typeof reason === "string" ? reason : String(reason?.message ?? reason),
      stack: typeof reason === "object" ? reason?.stack : undefined,
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
