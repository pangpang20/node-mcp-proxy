import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: false,
  target: 'node20',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
