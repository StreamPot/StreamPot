# Getting Started
## Installation

- [Node.js](https://nodejs.org/) version 18 or higher.

::: code-group

```sh [npm]
$ npm add -D streampot
```

```sh [pnpm]
$ pnpm add -D streampot
```

```sh [yarn]
$ yarn add -D streampot
```

```sh [bun]
$ bun add -D streampot
```

:::

## Usage

```js
import StreamPot from 'streampot'

const sp = new StreamPot({
    secret: 'your-api-key',
    baseUrl: 'https://localhost:3000', // optionally, if you're self hosting
});
```
