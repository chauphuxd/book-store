import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dns from "dns";
// https://vitejs.dev/config/server-options.html#server-options
dns.setDefaultResultOrder("verbatim");
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        port: 3000,
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler", // or "modern"
                silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
            },
        },
    },
});
