import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Dev-only sink for client-side errors (see src/lib/reportClientError.ts).
 * Prints the real stack in the terminal instead of leaving a blank page.
 */
function clientErrorLogger(): Plugin {
  return {
    name: "client-error-logger",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__client-error", (req, res) => {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          console.log("\n[client-error] " + body.slice(0, 4000) + "\n");
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), clientErrorLogger()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
