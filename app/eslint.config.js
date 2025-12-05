import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['dist/*', 'node_modules/*', 'public/*', 'coverage/*', 'src/presets/*']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      import: importPlugin,
      jsdoc,
      boundaries
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json'
        },
        node: true
      },
      'boundaries/elements': [
        { type: 'components', pattern: 'src/components' },
        { type: 'views', pattern: 'src/views' },
        { type: 'composables', pattern: 'src/composables' },
        { type: 'stores', pattern: 'src/stores' },
        { type: 'utils', pattern: 'src/utils' },
        { type: 'types', pattern: 'src/types' },
        { type: 'constants', pattern: 'src/constants' },
        { type: 'services', pattern: 'src/services' },
        { type: 'locales', pattern: 'src/locales' }
      ]
    },
    rules: {
      // 🛡️ GOVERNANCE RULES 🛡️
      
      // 1. Enforce strict TypeScript (No 'any')
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 2. Naming Conventions
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        }
      ],

      // 3. Complexity & Hygiene
      'complexity': ['error', 15],
      'max-depth': ['error', 4],
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'no-magic-numbers': ['warn', { 
        ignore: [-1, 0, 1, 2, 10, 100, 1000], 
        ignoreArrayIndexes: true, 
        ignoreDefaultValues: true, 
        ignoreClassFieldInitialValues: true 
      }],

      // 4. Vue Specifics
      'vue/multi-word-component-names': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/no-v-html': 'warn',
      
      // 5. Clean Code
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // 6. Boundaries & Architecture
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            {
              from: 'components',
              disallow: ['views'],
              message: 'Components should not import from Views'
            },
            {
              from: 'utils',
              allow: ['types', 'constants'],
              disallow: ['components', 'views', 'composables', 'stores'],
              message: 'Utils must be pure and not import app logic'
            },
            {
              from: 'types',
              disallow: ['components', 'views', 'composables', 'stores', 'utils'],
              message: 'Types should not import runtime code'
            }
          ]
        }
      ],

      // 7. JSDoc
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false
          },
          contexts: [
            'ExportNamedDeclaration > FunctionDeclaration',
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression'
          ]
        }
      ],
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off'
    }
  },
  prettier
)
