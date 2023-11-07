import {defineConfig} from 'tsup';

export default defineConfig({
	dts: true,
	entry: ['src/index.ts'],
	format: ['esm'],
	minify: true,
	outDir: 'build',
	platform: 'node',
	shims: false,
	sourcemap: true,
	splitting: true,
	target: 'node16',
});
