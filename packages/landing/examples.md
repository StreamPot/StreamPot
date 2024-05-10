# StreamPot client examples

This page demonstrates how to use StreamPot client from your server. It assumes you have the StreamPot project running somewhere (baseUrl).

## Trim a video
```js
import StreamPot from '@streampot/client'

const EXAMPLE_INPUT_VIDEO = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

const client = new StreamPot({
    secret:"test",
    baseUrl: 'http://127.0.0.1:3000' // depends where you are hosting StreamPot server. Check out our readme for how to run the server.
});

const clipJob = await client.input(EXAMPLE_BUNNY_MP4_1MB)
    .setStartTime(1)
    .setDuration(2)
    .output('output.mp4')
    .run()

while (true) {
    const submittedJob = await client.checkJob(id);
    if (submittedJob.status === 'complete') {
        console.log('URL of clipped video is:', submittedJob.output_url);
        break;
    } else if (submittedJob.status === 'failed') {
        console.log('Job failed');
        break;
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
}

```

## Add watermark

```js
const EXAMPLE_WATERMARK_ORANGE = 'https://pngfre.com/wp-content/uploads/orange-poster.png'
const EXAMPLE_INPUT_VIDEO = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

const client = new StreamPot({
    secret:"test",
    baseUrl: 'http://127.0.0.1:3000' // depends where you are hosting StreamPot server
});

const clipJob = await client.input(EXAMPLE_BUNNY_MP4_1MB)
    .input(EXAMPLE_WATERMARK_ORANGE)
    .complexFilter([
        {
            filter: 'scale',
            options: { w: 'iw*0.1', h: 'ih*0.1' },
            inputs: '1:v',
            outputs: 'scaled'
        },
        {
            filter: 'overlay',
            options: { x: 100, y: 100 },
            inputs: ['0:v', 'scaled']
        }
    ])
    .output('output5.mp4')
    .run()

while (true) {
    const submittedJob = await client.checkJob(id);
    if (submittedJob.status === 'complete') {
        console.log('URL of clipped video is:', submittedJob.output_url);
        break;
    } else if (submittedJob.status === 'failed') {
        console.log('Job failed');
        break;
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
}
```

## Convert a video

Here's how you can convert a video from one format to another:

```js
client.input('https://your-video.mp4').output('output.mkv').run()
```

## Concatenate different videos

Here's how you can concatenate two different videos by using the `concat` and `scale` filters:

```js
const VIDEO1 = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";
const VIDEO2 = 'https://download.samplelib.com/mp4/sample-5s.mp4';

client
  .input(VIDEO1)
  .input(VIDEO2)
  .complexFilter([
    // Scale first video and set SAR
    '[0:v]scale=1920:1080,setsar=1[v0]',
    // Concat filter
    '[v0][1:v]concat=n=2:v=1:a=0'
  ])
  .output('merged.mp4')
```

If you have questions, please feel free to [open an issue in our repo](https://github.com/jackbridger/streampot/issues/new)
