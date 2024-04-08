# Streampot

*Note: this is in the very early stages of development*

StreamPot is a project that provides scaffolding for transforming media (e.g. trimming a video, stripping the audio from a video, transcoding a video from mp4 to webp).

We are building this because an increasing number of projects are transforming media as part of their workflow. 

```js
import StreamPot from 'streampot'

const EXAMPLE_INPUT_VIDEO = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

const sp = new StreamPot();

async function clipVideo(input, start, end) {
    const job = await sp
        .input(input)
        .startAt(start)
        .endAt(end)
        .run();
    return job;
}

async function pollJob(id) {
    while (true) {
        const submittedJob = await sp.checkJob(id);
        if (submittedJob.status === 'complete') {
            console.log('URL of clipped video is:', submittedJob.output_url);
            break;
        } else if (submittedJob.status === 'failed') {
            console.log('Job failed');
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

async function runJob() {
    const job = await clipVideo(EXAMPLE_INPUT_VIDEO, 10, 20)
    pollJob(job.id)
}

runJob()

```

## How it works

StreamPot helps you install and run a nodejs server that has ffmpeg installed and a Fluent ffmpeg-like API to interface with.

It also includes job management/queuing as well as upload/downloads to remote locations.
