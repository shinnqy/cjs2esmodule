## Preview
![avatar](./preview.png)

## Install

```cmd
npm i cjs2esmodule
// or
yarn add cjs2esmodule
```

## Usage

### Using in vite.js
This will use `babel` to transform `AST`. If it's too slow, prefer to use script version to transform files.

```js
import { defineConfig } from 'vite'
import { cjs2esmVitePlugin } from 'cjs2esmodule'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [cjs2esmVitePlugin()]
})
```

### Using script to transform files.
Used `glob` under the hood, so it will follow the pattern.

```js
const { transformFiles } = require('cjs2esmodule')

transformFiles('./scripts/test.js')
// Support Array
transformFiles(['./utils/*.js', './components/*.js'])
```
