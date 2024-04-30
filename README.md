# Streampot

*Note: this is in the very early stages of development*

StreamPot is a project that provides scaffolding for transforming media in your app (e.g. trimming a video, stripping the audio from a video, transcoding a video from mp4 to webp).

We are building this because an increasing number of projects are transforming media as part of their workflow. 

If you want a no-setup way to run this, check out [StreamPot](https://www.streampot.io/) - coming soon.

## Running the server locally

### Add your s3 bucket details to .env
You can copy the .env.example format and set
* S3_ACCESS_KEY
* S3_SECRET_KEY
* S3_BUCKET_NAME
* S3_ENDPOINT

### Add redis details to .env
E.g.
* REDIS_HOST=redis
* REDIS_PORT=6379
* REDIS_PASSWORD=redis

### Run the app
```cd packages/server && docker-compose up```

## Running a job in your app
Note: You should only run this from your server.

### Install the client library

```pnpm i streampot```

### Initialise the client & submit a job.
```js
import StreamPot from 'streampot'
const EXAMPLE_VID = 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4'

const client = new StreamPot({
    secret: 'secret',
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