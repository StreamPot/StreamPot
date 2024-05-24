# StreamPot

> [!NOTE]
> **StreamPot is still in the early stages of development, we would appreciate your feedback.**

StreamPot is a project that provides scaffolding for transforming media in your app (e.g. trimming a video, stripping the audio from a video, transcoding a video from mp4 to webp).

We are building this because an increasing number of projects are transforming media as part of their workflow. 

If you want a no-setup way to run this, check out [StreamPot](https://www.streampot.io/) - coming soon.

## Running the server locally

Visit the [Installation (server)](https://www.streampot.io/installation.html#setting-up-the-server-without-docker) page for self-hosting instructions.
If you'd like to use the **hosted version**, please [sign up](https://app.streampot.io/register) and give it a try.

## Running a job in your app
Note: You should only run this from your server.

### Install the client library

```pnpm i @streampot/client```

### Initialise the client & submit a job.
```js
import StreamPot from '@streampot/client'
const EXAMPLE_VID = 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'

const client = new StreamPot({
    baseUrl: 'http://127.0.0.1:3000', // adjust if you are serving in production
})

const clipJob = await client.input(EXAMPLE_VID)
    .setStartTime(1)
    .setDuration(2)
    .output('output.mp4')
    .run()
const jobId = clipJob.id

// In production you should set up a poll.
setTimeout(async () => {
    const job = await client.checkStatus(jobId)
    if (job.status === 'completed'){
        console.log(job.output_url)
    } 
},10000) // wait 10 seconds
```

## Acknowledgements

This project is heavily reliant on the amazing work of the ffmpeg and fluent-ffmpeg teams 

## Feedback

If you want to use StreamPot in your project, I'd be happy to help & improve it based on your feedback. Email me at jack@bitreach.io or [let's have a call](https://cal.com/jackbridger/30min). 
