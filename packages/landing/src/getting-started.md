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

Set up your video processing job. This example takes a video, starts at 3 seconds, and clips 6 seconds out, saving it as 'output.mp4'.

```js
const clipJob = await streampot
    .input(
        'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
    )
    .setStartTime(3) // start at 3 seconds
    .setDuration(6) // end at 9 seconds
    .output('output.mp4')
    .run();
const jobId = clipJob.id;
```

### 5) Wait for it to finish

Poll the job status until it completes. This example uses a simple loop to check the job status every second.

```js
while (true) {
    const job = await streampot.checkStatus(jobId);
    if (job.status === 'completed') {
        console.log(job);
        return;
    } else if (job.status === 'failed') {
        throw new Error('StreamPot job failed');
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
}
```
