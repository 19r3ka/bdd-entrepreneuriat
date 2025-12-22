import { fileURLToPath, URL } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        'leaflet/dist/images/marker-icon.png': fileURLToPath(
          new URL('./tests/mocks/fileMock.ts', import.meta.url)
        ),
        'leaflet/dist/images/marker-icon-2x.png': fileURLToPath(
          new URL('./tests/mocks/fileMock.ts', import.meta.url)
        ),
        'leaflet/dist/images/marker-shadow.png': fileURLToPath(
          new URL('./tests/mocks/fileMock.ts', import.meta.url)
        ),
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          fileURLToPath(new URL('./tests/mocks/fileMock.ts', import.meta.url)),
      },
    },
    test: {
      server: {
        deps: {
          inline: ['leaflet', 'leaflet.markercluster'],
        },
      },
      setupFiles: ['tests/setup.ts'],
      environment: 'happy-dom',
      globals: true,
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'dist/',
          '**/*.d.ts',
          '**/*.test.ts',
          '**/*.spec.ts',
          'tests/setup.ts',
        ],
      },
    },
  })
);
