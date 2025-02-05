// module.exports = [
//   {
//     files: ['**/*.js'],
//     rules: {
//       // Common
//       'no-useless-catch': 0,
//       'no-console': 1,
//       'no-extra-boolean-cast': 0,
//       'no-lonely-if': 1,
//       'no-unused-vars': 1,
//       'no-trailing-spaces': 1,
//       'no-multi-spaces': 1,
//       'no-multiple-empty-lines': 1,
//       'space-before-blocks': ['error', 'always'],
//       'object-curly-spacing': [1, 'always'],
//       'indent': ['warn', 2],
//       'semi': [1, 'never'],
//       'quotes': ['error', 'single'],
//       'array-bracket-spacing': 1,
//       'linebreak-style': 0,
//       'no-unexpected-multiline': 'warn',
//       'keyword-spacing': 1,
//       'comma-dangle': 1,
//       'comma-spacing': 1,
//       'arrow-spacing': 1
//     }
//   }
// ]

module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      classProperties: true
    }
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['react', 'prettier'],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    quotes: [2, 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'no-console': 'warn',
    'prettier/prettier': 'error',
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['*/.spec.*'],
      env: {
        mocha: true
      },
      rules: {}
    }
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  }
}