import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        IntersectionObserver: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        HTMLElement: 'readonly',
        global: 'readonly',
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      // Stylistic rules
      'indent': ['error', 2],
      'linebreak-style': 'off', // Allow both CRLF and LF
      'quotes': ['error', 'double', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      
      // Best practices
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'comma-spacing': 'error',
      'key-spacing': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    },
  },
  {
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
      '*.config.js',
      'public/',
    ],
  },
];
