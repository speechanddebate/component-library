/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// TODO - re-enable eslint plugin when it supports flat config
// import eslint from 'vite-plugin-eslint';

import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr({ svgrOptions: { icon: true } })],
    build: {
        outDir: 'build/public',
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/setupTests.ts',
        coverage: {
            reporter: ['text', 'html'],
            exclude: ['node_modules/', 'test/setupTests.ts'],
        },
    },
    envPrefix: 'NSDA_',
});
