# Streampot

*Note: this is in the very early stages of development*

StreamPot is a project that provides scaffolding for transforming media (e.g. trimming a video, stripping the audio from a video, transcoding a video from mp4 to webp).

We are building this because an increasing number of projects are transforming media as part of their workflow. 

If you want a no-setup way to run this, check out [StreamPot](https://www.streampot.io/)

```js
import StreamPot from 'streampot'

const sp = new StreamPot({
    secret:"test"
});

sp
    .input(inputUrl)
    .startAt(startTime)
    .endAt(endTime)
    .run();

```
Check out a [full example here](https://www.streampot.io/examples.html)

## How it works

StreamPot helps you install and run a nodejs server that has ffmpeg installed and a Fluent ffmpeg-like API to interface with.

It also includes job management/queuing as well as upload/downloads to remote locations.

You will need to self host packages/server to run this and then update the url when initialising the SDK. (Work in progress)