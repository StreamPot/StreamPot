# Getting Started
## Installation

- [Node.js](https://nodejs.org/) version 18 or higher.

::: code-group

```sh [npm]
$ npm add -D @streampot/client
```

```sh [pnpm]
$ pnpm add -D @streampot/client
```

```sh [yarn]
$ yarn add -D @streampot/client
```

:::

## Usage

```js
import StreamPot from '@streampot/client'

const sp = new StreamPot({
    secret: 'your-api-key',
    baseUrl: 'https://localhost:3000', // optionally, if you're self hosting
});
```
