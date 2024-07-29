# Get started with StreamPot in Node.js

### 1) Create a [StreamPot account](https://streampot.io/register) and generate an API key.

### 2) Install the StreamPot client in your project using your preferred package manager.

::: code-group

```sh [npm]
$ npm i @streampot/client
```

```sh [pnpm]
$ pnpm add -D @streampot/client
```

```sh [yarn]
$ yarn add -D @streampot/client
```

:::

### 3) Import the StreamPot Client

`import StreamPot from '@streampot/client'`

### 4) Initialize StreamPot with your API key

Initialize the StreamPot client with your API key to authenticate your requests.

```js
const streampot = new StreamPot({
    secret: 'YOUR_API_KEY',
});
```

### 5) Run your command

Set up your video processing job. This example converts an mp4 video to mp3 audio.

```js
const convertedVideo = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    )
    .output('output.mp3')
    .runAndWait();
```

### 6) Wait for it to complete

You can either simply await the change. A completed result will be like the below:

```js
// convertedVideo
{
  id: 235,
  status: 'completed',
  outputs: {
    'output.mp3': 'https://assets.streampot.io/750015a1-4572-4a90-a9ae-f6c9a1be8370-output.mp3'
  },
  logs: '',
  created_at: '2024-06-08T19:51:56.000000Z'
}
```

You can also poll it manually, you can see more details in our examples.
