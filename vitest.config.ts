import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'api-design/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
