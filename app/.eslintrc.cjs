/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // The order matters: extend Vue specific, then TS, then Prettier (last to override formatting rules)
  extends: [
    'plugin:vue/vue3-recommended', // Strongest Vue enforcement
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier' // Must be last: disables ESLint rules that conflict with Prettier
  ],
  parser: 'vue-eslint-parser', // Required to parse .vue files
  parserOptions: {
    parser: '@typescript-eslint/parser', // Required to parse TS inside .vue files
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // 🛡️ GOVERNANCE RULES 🛡️
    
    // 1. Enforce strict TypeScript (No 'any')
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: turn on if you want strict return types on functions

    // 2. Vue Specifics
    'vue/multi-word-component-names': 'error', // Prevents generic names like "Table.vue"
    'vue/component-api-style': ['error', ['script-setup']], // Enforce <script setup> usage only
    'vue/no-v-html': 'warn', // XSS protection
    
    // 3. Clean Code
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off', // Turn off base rule...
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // ...use TS rule instead
  },
}