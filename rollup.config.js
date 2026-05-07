import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/render-bundle.js",
  output: {
    file: "dist/render-bundle.js",
    format: "esm",
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true,
      moduleDirectories: ["node_modules"],
      extensions: [".js", ".mjs"],
      exportConditions: ["module"]   
    }),
    commonjs(),
    terser()
  ]
};
