import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  logger: { 
    logEvent: (filename, event) => { 
      if(event.kind === 'CompileSuccess') {  
        console.log(` Optimized: ${filename}`) ; 
      }
      if(event.kind === 'CompileError') { 
        console.log( `Skipped : ${filename}-> ${event.detail.reason} `) ; 
      }
    }
  }
});
