import { resolve } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({
      open: true, //注意这里要设置为true，否则无效
      filename: "analyze.html", //分析图生成的文件名
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true, // 收集 brotli 大小并将其显示
    }),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
