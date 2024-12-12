# TravelSplit – The Easiest Way to Split Trip Costs

Simplifies tracking and splitting trip expenses.
- Add expenses and split them among the group members.
- See summary of the total expenses and the amount each person owes or is owed.

## Quick Start

```bash
npm install
npm dev
```
open: http://localhost:8080/

## Screenshot

![Screenshot](img/screenshot.png?raw=true)

## Development Guide

### Setup Authorship

Please setup commits authorship right after cloning the Git repository.

```bash
git config user.name "<Your Name>"
git config user.email "<Your Email>@gmail.com"
```

### Run unit tests

```bash
npm test
```

### Building for Production

Create a production build:

```bash
npm build
```


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

