import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'brand/', 'relatorios/'] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...(eslintPluginAstro.configs['jsx-a11y-strict'] ?? []),
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'integrations/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
];
