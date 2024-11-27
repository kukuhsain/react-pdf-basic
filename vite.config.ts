import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'ReactPdfBasic',
      // the proper extensions will be added
      fileName: 'react-pdf-basic',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },
})
