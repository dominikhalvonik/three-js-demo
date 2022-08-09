import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import viteCompression from 'vite-plugin-compression';

export default ({ mode }) => {
    // Load app-level env vars to node-level env vars.
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        server: {
            port: 8080,
            host: true,
            hmr: {
                port: 3000
            },
        },
        plugins: [
            vue(),
            viteCompression({
                algorithm: 'brotliCompress',
                deleteOriginFile: false,
                ext: '.br',
                verbose: true,
              })
        ],
        define: {
            '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis
                define: {
                    global: 'globalThis'
                },
                // Enable esbuild polyfill plugins
                plugins: [
                    GlobalsPolyfills({
                        buffer: true
                    })
                ]
            }
        }
    })
}
// https://vitejs.dev/config/
