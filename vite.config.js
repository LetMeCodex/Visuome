import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { build as esbuild } from "esbuild";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function extensionEntries() {
  return {
    name: "extension-entries",
    async closeBundle() {
      await mkdir(resolve("dist"), { recursive: true });
      await Promise.all([
        esbuild({
          entryPoints: [resolve("src/content/contentScript.js")],
          outfile: resolve("dist/contentScript.js"),
          bundle: true,
          format: "iife",
          platform: "browser",
          target: "chrome114",
          legalComments: "none",
        }),
        esbuild({
          entryPoints: [resolve("src/background/serviceWorker.js")],
          outfile: resolve("dist/serviceWorker.js"),
          bundle: true,
          format: "esm",
          platform: "browser",
          target: "chrome114",
          legalComments: "none",
        }),
        copyFile(resolve("manifest.json"), resolve("dist/manifest.json")),
      ]);
    },
  };
}

export default defineConfig({
  plugins: [react(), extensionEntries()],
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve("index.html"),
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
