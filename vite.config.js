import { defineConfig } from "vite"

export default defineConfig({
  base: "/",
  publicDir: "static",
  server: {
    host: "0.0.0.0",
    port: 8081,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 8081,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    sourcemap: false,
    target: "es2022",
  },
})
