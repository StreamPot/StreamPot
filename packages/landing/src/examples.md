# StreamPot client examples

This page demonstrates how to use StreamPot client from your server.

## Initial setup

```js
import StreamPot from '@streampot/client';

const streampot = new StreamPot({
    secret: 'YOUR_SECRET', // get this by creating a key in the StreamPot admin panel.
});
```

## Submitting your first job

```js
// Below is an example transcoding a video from mp4 to mp3.
const convertedVideo = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    )
    .output('output.mp3')
    .runAndWait();
```

### First job response

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

_Note: Your `outputs` will be an object where the key corresponds to the output file name you gave (e.g. output.mp3) in your command. The value corresponds to the public url._

### Failed jobs

If, for example, I try to convert my video to output.teapot, you will get a status `failed`. You will also a logs message.

```js
{
  id: 243,
  status: 'failed',
  outputs: [],
  logs: "[AVFormatContext @ 0x56099b385840] Unable to choose an output format for 'output.teapot'; use a standard extension for the filename or specify the format manually.\n" +
    '[out#0 @ 0x56099b355f40] Error initializing the muxer for output.teapot: Invalid argument\n' +
    'Error opening output file output.teapot.\n' +
    'Error opening output files: Invalid argument\n',
  created_at: '2024-06-08T19:57:01.000000Z'
}
```

You can also see a list of your jobs and whether they succeeded or failed in your dashboard.
Note that some complex jobs may take multiple minutes (or longer) to complete.

## Manual polling

Sometimes you might want to poll your jobs manually. Or submit them and check back later.

Here is an example when trimming a video

```js
const job = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    )
    .setStartTime(1)
    .setDuration(2)
    .output('output.mp4')
    .run();
```

Initially, job is:

```js
// job
{
  id: 247,
  status: 'pending',
  outputs: [],
  logs: null,
  created_at: '2024-06-08T20:06:19.000000Z'
}
```

But after waiting 10 seconds, I use the `getJob` method and find it is completed.

```js
const result = await streampot.getJob(job.id);
```

```js
// result
{
  id: 247,
  status: 'completed',
  outputs: {
    'output.mp4': 'https://assets.streampot.io/4c134cbd-0dfc-4d39-b65f-c086a5c94eeb-output.mp4'
  },
  logs: '',
  created_at: '2024-06-08T20:06:19.000000Z'
}
```

## Concatenate different videos

Here's how you can concatenate two different videos by using the `concat` and `scale` filters:

```js
const response = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    )
    .input('https://download.samplelib.com/mp4/sample-5s.mp4')
    .complexFilter([
        // Scale first video and set SAR
        '[0:v]scale=1920:1080,setsar=1[v0]',
        // Concat filter
        '[v0][1:v]concat=n=2:v=1:a=0',
    ])
    .output('merged.mp4')
    .runAndWait();
console.log(response.outputs['merged.mp4']);
// https://assets.streampot.io/43d17a2e-791b-474f-8655-797853ff181a-merged.mp4
```

## Add watermark

```js
const watermarkedVideo = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    ) // buck bunny video
    .input('https://pngfre.com/wp-content/uploads/orange-poster.png') // picture of orange
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
    .runAndWait();
console.log(watermarkedVideo.outputs['output5.mp4']);
// https://assets.streampot.io/c328cf7b-282a-4398-94c6-757fce67ea98-output5.mp4
```

## Add audio to a video

Here's how you can add audio to a video

```js
const audioAndVideo = await streampot
    .addInput(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    ) // your video file input path
    .addInput(
        'https://d38nvwmjovqyq6.cloudfront.net/va90web25003/companions/ws_smith/1%20Comparison%20Of%20Vernacular%20And%20Refined%20Speech.mp3'
    ) // your audio file input path
    .output('output1.mp4') // your output path
    .outputOptions([
        '-map',
        '0:v', // Map the video stream from the first input
        '-map',
        '1:a', // Map the audio stream from the second input
        '-c:v',
        'copy', // Copy the video stream without re-encoding
        '-c:a',
        'aac', // Encode the audio stream to AAC (or any codec you prefer)
        '-shortest', // Ensure the output ends when the shortest stream ends
    ])
    .runAndWait();
console.log(audioAndVideo.outputs['output1.mp4']);
// https://assets.streampot.io/99c1b998-d582-4ea7-9051-ba42c2ed126b-output1.mp4
```

## Lower volume of video

```js
const reducedVolume = await streampot
    .addInput(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    ) // your video file input path
    .outputOption([
        '-c:v',
        'copy', // Copy the video stream without re-encoding
        '-filter:a',
        'volume=0.2', // Adjust the audio volume to 20% of the original
    ])
    .output('output1.mp4') // your output path
    .runAndWait();
console.log(reducedVolume.outputs['output1.mp4']);
// https://assets.streampot.io/170ec4fd-c1c9-4f95-b3a0-9c59be8a4e10-output1.mp4
```

## Change resolution

```js
const lowResolutionVideo = await streampot
    .addInput(
        'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
    ) // bigger video
    .output('output1.mp4')
    .videoCodec('libx264')
    .noAudio()
    .size('640x360')
    .runAndWait();

console.log(lowResolutionVideo.outputs['output1.mp4']);
```

## Crop video dimensions

```js
const croppedVideo = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
    )
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
    .runAndWait();
console.log(croppedVideo.outputs['output.mp4']);
// https://assets.streampot.io/ed2e657f-57d9-4d7b-ab98-75dbbacf7b26-output.mp4
```

## Convert audio

```js
const wavFile = await streampot
    .input(
        'https://d38nvwmjovqyq6.cloudfront.net/va90web25003/companions/ws_smith/1%20Comparison%20Of%20Vernacular%20And%20Refined%20Speech.mp3'
    )
    .toFormat('wav')
    .output('output.wav')
    .runAndWait();
console.log(wavFile.outputs['output.wav']);
// https://assets.streampot.io/57c02fee-a411-42ff-9b9f-9036100bcf97-output.wav
```

## Extract audio from video

```js
const audioOnly = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    )
    .noVideo()
    .format(`mp3`)
    .output('output.mp3')
    .runAndWait();
console.log(audioOnly.outputs['output.mp3']);
// https://assets.streampot.io/6a857113-0ceb-437b-a23f-c311fd79a681-output.mp3
```

## Get frame

```js
const frame = await streampot
    .input(
        'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'
    )
    .seekInput('00:00:02.000') // Seek to the specified timestamp
    .outputOptions('-frames:v 1') // Extract only one frame
    .output('my_image123.png')
    .runAndWait();

console.log(frame.outputs['my_image123.png']);
// https://assets.streampot.io/5d167a6e-e9ec-4eb2-95e9-023b7fa1715e-my_image123.png
```

## Make video from an image

```js
const videoFromImage = await streampot
    .input(
        'https://pub-6ec5ee854d2241de8b41ffcf29bfb6ee.r2.dev/a924d75b-4620-4253-9aa8-967ebc00c027-my_image123.png'
    )
    .loop(20)
    .input(
        'https://d38nvwmjovqyq6.cloudfront.net/va90web25003/companions/ws_smith/1%20Comparison%20Of%20Vernacular%20And%20Refined%20Speech.mp3'
    )
    .outputOptions([
        '-c:v',
        'libx264', // Encode the video stream to H.264
        '-c:a',
        'aac', // Encode the audio stream to AAC
        '-shortest', // Ensure the output ends when the shortest stream ends
        '-pix_fmt',
        'yuv420p', // Ensure compatibility with most players
    ])
    .output('output.mp4')
    .runAndWait();
console.log(videoFromImage.outputs['output.mp4']);
// https://assets.streampot.io/14859e9d-93b1-4f94-9e9f-365ec4406335-output.mp4
```

If you have questions, please feel free to [open an issue in our repo](https://github.com/jackbridger/streampot/issues/new)

Also, you can use ChatGPT and reference the fluent-ffmpeg SDK because the methods are mostly the same.
