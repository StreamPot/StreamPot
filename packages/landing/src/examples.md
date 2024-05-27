# StreamPot client examples

This page demonstrates how to use StreamPot client from your server.

## Initial setup

```js
import StreamPot from '@streampot/client';

const client = new StreamPot({
    secret: 'YOUR_SECRET',
});
```

## Waiting for a job to complete

You can use a little helper function to wait for a job to complete:

```js
async function waitForJob(job, interval = 3000) {
    while (true) {
        const job = await client.checkJob(job.id);

        if (job.status === 'complete') return job;
        if (job.status === 'failed')
            throw new Error(`Job failed: ${job.error}`);

        await new Promise((resolve) => setTimeout(resolve, interval));
    }
}

// Describe all the logic when you submit a job
const submittedJob = await client
    .input('https://your-video.mp4')
    .output('output.mp3')
    .run();

// Wait for the job to complete using the helper function from above
const completedJob = await waitForJob(submittedJob);

// Log the output URL
console.log('URL of output audio is:', completedJob.output_urls[0].public_url);
```

## Trim a video

```js
const EXAMPLE_INPUT_VIDEO =
    'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4';

streampot
    .input(EXAMPLE_INPUT_VIDEO)
    .setStartTime(1)
    .setDuration(2)
    .output('output.mp4')
    .run();
```

## Convert a video

Here's how you can convert a video from one format to another:

```js
streampot.input(EXAMPLE_INPUT_VIDEO).output('output.mkv').run();
```

## Concatenate different videos

Here's how you can concatenate two different videos by using the `concat` and `scale` filters:

```js
const EXAMPLE_VIDEO_1 =
    'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4';
const EXAMPLE_VIDEO_2 = 'https://download.samplelib.com/mp4/sample-5s.mp4';

streampot
    .input(EXAMPLE_VIDEO_1)
    .input(EXAMPLE_VIDEO_2)
    .complexFilter([
        // Scale first video and set SAR
        '[0:v]scale=1920:1080,setsar=1[v0]',
        // Concat filter
        '[v0][1:v]concat=n=2:v=1:a=0',
    ])
    .output('merged.mp4')
    .run();
```

## Add watermark

```js
const EXAMPLE_WATERMARK_ORANGE =
    'https://pngfre.com/wp-content/uploads/orange-poster.png';
const EXAMPLE_INPUT_VIDEO =
    'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4';

streampot
    .input(EXAMPLE_INPUT_VIDEO)
    .input(EXAMPLE_WATERMARK_ORANGE)
    .complexFilter([
        {
            filter: 'scale',
            options: { w: 'iw*0.1', h: 'ih*0.1' },
            inputs: '1:v',
            outputs: 'scaled',
        },
        {
            filter: 'overlay',
            options: { x: 100, y: 100 },
            inputs: ['0:v', 'scaled'],
        },
    ])
    .output('output5.mp4')
    .run();
```

## Add audio to a video

Here's how you can add audio to a video

```js
const EXAMPLE_VIDEO_1 =
    'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4';
const EXAMPLE_AUDIO =
    'https://d38nvwmjovqyq6.cloudfront.net/va90web25003/companions/ws_smith/1%20Comparison%20Of%20Vernacular%20And%20Refined%20Speech.mp3';

streampot
    .addInput(EXAMPLE_VIDEO_1)
    .addInput(EXAMPLE_AUDIO)
    .output('output1.mp4')
    .outputOptions([
        '-map',
        '0:v',
        '-map',
        '1:a',
        '-c:v',
        'copy',
        '-c:a',
        'aac',
        '-shortest',
    ])
    .run();
```

## Lower volume of video

```js
const EXAMPLE_VIDEO_1 =
    'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4';
streampot
    .addInput(EXAMPLE_VIDEO_1) // your video file input path
    .outputOption([
        '-c:v',
        'copy', // Copy the video stream without re-encoding
        '-filter:a',
        'volume=0.2', // Adjust the audio volume to 20% of the original
    ])
    .output('output1.mp4') // your output path
    .run();
```

## Change resolution

```js
const BIG_VIDEO =
    'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
streampot
    .addInput(BIG_VIDEO)
    .output('output1.mp4')
    .videoCodec('libx264')
    .noAudio()
    .size('640x360')
    .run();
```

## Crop video dimensions

```js
const BIG_VIDEO =
    'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
streampot
    .input(BIG_VIDEO)
    .videoFilters([
        {
            filter: 'crop',
            options: {
                w: 100,
                h: 100,
            },
        },
    ])
    .output('output.mp4')
    .run();
```

## Convert audio

```js
const EXAMPLE_AUDIO =
    'https://d38nvwmjovqyq6.cloudfront.net/va90web25003/companions/ws_smith/1%20Comparison%20Of%20Vernacular%20And%20Refined%20Speech.mp3';
streampot.input(EXAMPLE_AUDIO).toFormat('wav').output('output.wav').run();
```

## Extract audio from video

```js
const EXAMPLE_VIDEO_1 =
    'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4';
streampot
    .input(EXAMPLE_VIDEO_1)
    .noVideo()
    .format(`mp3`)
    .output('output.mp3')
    .run();
```

## Get frame

```js
const EXAMPLE_VIDEO_1 =
    'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4';
streampot
    .input(EXAMPLE_VIDEO_1)
    .seekInput(timestamp)
    .outputOptions('-frames:v 1')
    .output('my_image123.png')
    .run();
```

## Make video from an image

```js
const EXAMPLE_IMAGE =
    'https://pub-6ec5ee854d2241de8b41ffcf29bfb6ee.r2.dev/a924d75b-4620-4253-9aa8-967ebc00c027-my_image123.png';
const EXAMPLE_AUDIO =
    'https://d38nvwmjovqyq6.cloudfront.net/va90web25003/companions/ws_smith/1%20Comparison%20Of%20Vernacular%20And%20Refined%20Speech.mp3';
streampot
    .input(EXAMPLE_IMAGE)
    .loop(20)
    .input(EXAMPLE_AUDIO)
    .outputOptions([
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-shortest',
        '-pix_fmt',
        'yuv420p',
    ])
    .output('output.mp4')
    .run();
```

If you have questions, please feel free to [open an issue in our repo](https://github.com/jackbridger/streampot/issues/new)

Also, you can use ChatGPT and reference the fluent-ffmpeg SDK because the methods are mostly the same.
