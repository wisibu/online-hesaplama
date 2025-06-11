// @ts-check

import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';

/** @type {import('typescript-eslint').Config} */
export default tseslint.config(
  {
    ignores: ['.next/**', '**/*.config.js', '**/*.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactRecommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,mts,cts,tsx,mtsx}'],
    ...nextPlugin.configs['flat/recommended'],
    ...nextPlugin.configs['flat/core-web-vitals'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-case-declarations': 'warn'
    }
  }
); 