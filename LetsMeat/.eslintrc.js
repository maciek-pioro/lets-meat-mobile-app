module.exports = {
  'extends': [
    'airbnb',
    "plugin:react-hooks/recommended"
  ],
  'parser': 'babel-eslint',
  "plugins": [
    "only-warn"
  ],
  'env': {
    'jest': true,
  },
  'globals': {
    "fetch": false
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'no-nested-ternary': 'off'
  },
}
