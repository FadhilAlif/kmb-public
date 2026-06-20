import { Readable } from "node:stream";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import availabilityHandler from "./api/availability";
import bookingHandler from "./api/booking";

const applyLocalEnv = (mode: string): void => {
  const env = loadEnv(mode, process.cwd(), "");

  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value;
  }
};

const toWebRequest = (req: import("node:http").IncomingMessage): Request => {
  const host = req.headers.host ?? "localhost:8080";
  const url = new URL(req.url ?? "/", `http://${host}`);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value) {
      headers.set(key, value);
    }
  }

  const method = req.method ?? "GET";
  const hasBody = !["GET", "HEAD"].includes(method);

  return new Request(url, {
    method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: hasBody ? "half" : undefined,
  } as RequestInit & { duplex?: "half" });
};

const sendWebResponse = async (
  res: import("node:http").ServerResponse,
  response: Response,
): Promise<void> => {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));

  const body = await response.arrayBuffer();
  res.end(Buffer.from(body));
};

const localApiPlugin = (): Plugin => ({
  name: "kmb-local-api",
  configureServer(server) {
    server.middlewares.use("/api/availability", async (req, res) => {
      const response = await availabilityHandler(toWebRequest(req));
      await sendWebResponse(res, response);
    });

    server.middlewares.use("/api/booking", async (req, res) => {
      const response = await bookingHandler(toWebRequest(req));
      await sendWebResponse(res, response);
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  applyLocalEnv(mode);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      localApiPlugin(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Use a function-based approach to avoid the circular-chunk cycle.
          // The object form put React in "vendor" and React-dependent libs
          // (framer-motion, Radix UI, lucide-react) in "ui", but those libs
          // internally import React — creating a vendor→ui→vendor cycle that
          // breaks initialization order and throws at runtime.
          // Grouping all React-ecosystem code into one "vendor" chunk
          // eliminates the cycle while keeping Supabase separate for caching.
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("@supabase")) return "supabase";
            // Everything else (React, React-DOM, Router, Radix, Framer, etc.)
            // lands in vendor so peer-dependency ordering is guaranteed.
            return "vendor";
          },
        },
      },
    },
  };
});
