import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'node16',
  platform: 'node',
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  minify: true,
  dts: true,
  shims: false
})
