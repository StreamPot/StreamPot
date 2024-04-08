# Streampot

*Note: this is in the very early stages of development*

Streampot is a project to that provides scaffolding for transforming media.

We are building this because an increasing number of projects are transforming media as part of their workflow. 

This means you can run commands like:

```js
import StreamPot from 'streampot' 
const EXAMPLE_INPUT_VIDEO = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

const sp = new StreamPot();

async function clipVideo(input, start, end, outputPath) {
    // Assuming .run() returns a job object
    const job = await sp
        .setInput(input)
        .setStartTime(start)
        .setDuration(end - start)
        .setOutput(outputPath)
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
```

## How it works

Streampot helps you install and run a nodejs server that has ffmpeg installed and a Fluent ffmpeg-like API.
It also includes job management/queuing as well as upload/downloads to remote locations. 