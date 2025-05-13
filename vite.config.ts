import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (desarrollo, test, producción)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8081,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:2000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/api/v1/auth/sso': {
          target: 'http://localhost:2000',
          changeOrigin: true,
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Definir variables de entorno para el frontend
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV || mode)
    }
  };
});
