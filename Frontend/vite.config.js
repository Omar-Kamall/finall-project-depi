// في ملف Frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // ⬇️ أضف هذا القسم الجديد ⬇️
  build: {
    outDir: 'build', // هذا يخبر Vite بإنشاء مجلد باسم 'build'
  }
});
