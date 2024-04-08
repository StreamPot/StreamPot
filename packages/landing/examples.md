# StreamPot examples

This page demonstrates how to use StreamPot.

## Trim a video
```js
import StreamPot from 'streampot'

const EXAMPLE_INPUT_VIDEO = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

const sp = new StreamPot({
    secret:"test"
});

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

## How to run the server locally

1. ```git clone https://github.com/jackbridger/streampot```
2. ```cd packages/server && npm i && npm run dev``` 
3. Now use the example code as a base to submit jobs

If you have questions, please feel free to [open an issue in our repo](https://github.com/jackbridger/streampot/issues/new)