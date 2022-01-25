module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-underscore-dangle': ['off'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }]
  }
};
