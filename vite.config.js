import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({mode}) => { 
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}

  return defineConfig({
    model: mode,
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    },
    plugins: [vue()],
    optimizeDeps: {
    },
    server: {
      fs: {
        //allow: ['../../../']
      },
      port: process.env.VITE_PORT || 36980,
      host: process.env.VITE_HOST ||'0.0.0.0',
      hmr: {
        host: process.env.VITE_HMR_HOST || '0.0.0.0',
        clientPort: process.env.VITE_HMR_PORT || 36900,
        protocol: process.env.VITE_HMR_PROTOCOL || 'wss',
      }
    },
    base: '/xibex/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      dedupe: [
        'vue'
      ]
    }
  })
}
