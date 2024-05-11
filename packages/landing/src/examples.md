# StreamPot client examples

This page demonstrates how to use StreamPot client from your server. It assumes you have the StreamPot project running somewhere (baseUrl).

## Initial setup

```js
import StreamPot from '@streampot/client'

// Create a new client to interact with StreamPot
const client = new StreamPot({
    secret:  'test',
    baseUrl: 'http://127.0.0.1:3000' // your StreamPot server
});
```

## Waiting for a job to complete

You can use a little helper function to wait for a job to complete:

```js
async function waitForJob(job, interval = 3000) {
    while (true) {
        const job = await client.checkJob(job.id);
        
        if (job.status === 'complete') return job;
        if (job.status === 'failed') throw new Error(`Job failed: ${job.error}`);
        
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}


// Describe all the logic when you submit a job
const submittedJob = await client.input('https://your-video.mp4')
    .output('output.mp3')
    .run();

// Wait for the job to complete using the helper function from above
const completedJob = await waitForJob(submittedJob);

// Log the output URL
console.log('URL of output audio is:', completedJob.output_urls[0].public_url);
```

## Trim a video
```js
const EXAMPLE_INPUT_VIDEO = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

client.input(EXAMPLE_BUNNY_MP4_1MB)
    .setStartTime(1)
    .setDuration(2)
    .output('output.mp4')
    .run()
```

## Add watermark

```js
const EXAMPLE_WATERMARK_ORANGE = 'https://pngfre.com/wp-content/uploads/orange-poster.png'
const EXAMPLE_INPUT_VIDEO = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

client.input(EXAMPLE_BUNNY_MP4_1MB)
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
```

## Convert a video

Here's how you can convert a video from one format to another:

```js
client
  .input('https://your-video.mp4')
  .output('output.mkv')
  .run()
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
  .run()
```

If you have questions, please feel free to [open an issue in our repo](https://github.com/jackbridger/streampot/issues/new)
