import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "MyNodeApp",
      fileName: (format) => `my-node-app.${format}.js`,
    },
    rollupOptions: {
      external: ["fs", "path"],
    },
    target: "esnext",
    sourcemap: true,
  },
});
