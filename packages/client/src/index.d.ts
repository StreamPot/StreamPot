import { AudioVideoFilter, FilterSpecification } from './filters.ts';

export default class StreamPot {
    // options/inputs
    mergeAdd(source: string): StreamPot;

    addInput(source: string): StreamPot;

    input(source: string): StreamPot;

    withInputFormat(format: string): StreamPot;

    inputFormat(format: string): StreamPot;

    fromFormat(format: string): StreamPot;

    withInputFps(fps: number): StreamPot;

    withInputFPS(fps: number): StreamPot;

    withFpsInput(fps: number): StreamPot;

    withFPSInput(fps: number): StreamPot;

    inputFPS(fps: number): StreamPot;

    inputFps(fps: number): StreamPot;

    fpsInput(fps: number): StreamPot;

    FPSInput(fps: number): StreamPot;

    nativeFramerate(): StreamPot;

    withNativeFramerate(): StreamPot;

    native(): StreamPot;

    setStartTime(seek: string | number): StreamPot;

    seekInput(seek: string | number): StreamPot;

    loop(duration?: string | number): StreamPot;

    // options/audio
    withNoAudio(): StreamPot;

    noAudio(): StreamPot;

    withAudioCodec(codec: string): StreamPot;

    audioCodec(codec: string): StreamPot;

    withAudioBitrate(bitrate: string | number): StreamPot;

    audioBitrate(bitrate: string | number): StreamPot;

    withAudioChannels(channels: number): StreamPot;

    audioChannels(channels: number): StreamPot;

    withAudioFrequency(freq: number): StreamPot;

    audioFrequency(freq: number): StreamPot;

    withAudioQuality(quality: number): StreamPot;

    audioQuality(quality: number): StreamPot;

    withAudioFilter(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    withAudioFilters(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    audioFilter(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    audioFilters(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    // options/video;
    withNoVideo(): StreamPot;

    noVideo(): StreamPot;

    withVideoCodec(codec: string): StreamPot;

    videoCodec(codec: string): StreamPot;

    withVideoBitrate(bitrate: string | number, constant?: boolean): StreamPot;

    videoBitrate(bitrate: string | number, constant?: boolean): StreamPot;

    withVideoFilter(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    withVideoFilters(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    videoFilter(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    videoFilters(filters: string | string[] | AudioVideoFilter[]): StreamPot;

    withOutputFps(fps: number): StreamPot;

    withOutputFPS(fps: number): StreamPot;

    withFpsOutput(fps: number): StreamPot;

    withFPSOutput(fps: number): StreamPot;

    withFps(fps: number): StreamPot;

    withFPS(fps: number): StreamPot;

    outputFPS(fps: number): StreamPot;

    outputFps(fps: number): StreamPot;

    fpsOutput(fps: number): StreamPot;

    FPSOutput(fps: number): StreamPot;

    fps(fps: number): StreamPot;

    FPS(fps: number): StreamPot;

    takeFrames(frames: number): StreamPot;

    withFrames(frames: number): StreamPot;

    frames(frames: number): StreamPot;

    // options/videosize
    keepPixelAspect(): StreamPot;

    keepDisplayAspect(): StreamPot;

    keepDisplayAspectRatio(): StreamPot;

    keepDAR(): StreamPot;

    withSize(size: string): StreamPot;

    setSize(size: string): StreamPot;

    size(size: string): StreamPot;

    withAspect(aspect: string | number): StreamPot;

    withAspectRatio(aspect: string | number): StreamPot;

    setAspect(aspect: string | number): StreamPot;

    setAspectRatio(aspect: string | number): StreamPot;

    aspect(aspect: string | number): StreamPot;

    aspectRatio(aspect: string | number): StreamPot;

    applyAutopadding(pad?: boolean, color?: string): StreamPot;

    applyAutoPadding(pad?: boolean, color?: string): StreamPot;

    applyAutopad(pad?: boolean, color?: string): StreamPot;

    applyAutoPad(pad?: boolean, color?: string): StreamPot;

    withAutopadding(pad?: boolean, color?: string): StreamPot;

    withAutoPadding(pad?: boolean, color?: string): StreamPot;

    withAutopad(pad?: boolean, color?: string): StreamPot;

    withAutoPad(pad?: boolean, color?: string): StreamPot;

    autoPad(pad?: boolean, color?: string): StreamPot;

    autopad(pad?: boolean, color?: string): StreamPot;

    // options/output
    addOutput(target: string): StreamPot;

    output(target: string): StreamPot;

    seekOutput(seek: string | number): StreamPot;

    seek(seek: string | number): StreamPot;

    withDuration(duration: string | number): StreamPot;

    setDuration(duration: string | number): StreamPot;

    duration(duration: string | number): StreamPot;

    toFormat(format: string): StreamPot;

    withOutputFormat(format: string): StreamPot;

    outputFormat(format: string): StreamPot;

    format(format: string): StreamPot;

    map(spec: string): StreamPot;

    updateFlvMetadata(): StreamPot;

    flvmeta(): StreamPot;

    // options/custom
    addInputOption(options: string[]): StreamPot;
    addInputOption(...options: string[]): StreamPot;

    addInputOptions(options: string[]): StreamPot;
    addInputOptions(...options: string[]): StreamPot;

    withInputOption(options: string[]): StreamPot;
    withInputOption(...options: string[]): StreamPot;

    withInputOptions(options: string[]): StreamPot;
    withInputOptions(...options: string[]): StreamPot;

    inputOption(options: string[]): StreamPot;
    inputOption(...options: string[]): StreamPot;

    inputOptions(options: string[]): StreamPot;
    inputOptions(...options: string[]): StreamPot;

    addOutputOption(options: string[]): StreamPot;
    addOutputOption(...options: string[]): StreamPot;

    addOutputOptions(options: string[]): StreamPot;
    addOutputOptions(...options: string[]): StreamPot;

    addOption(options: string[]): StreamPot;
    addOption(...options: string[]): StreamPot;

    addOptions(options: string[]): StreamPot;
    addOptions(...options: string[]): StreamPot;

    withOutputOption(options: string[]): StreamPot;
    withOutputOption(...options: string[]): StreamPot;

    withOutputOptions(options: string[]): StreamPot;
    withOutputOptions(...options: string[]): StreamPot;

    withOption(options: string[]): StreamPot;
    withOption(...options: string[]): StreamPot;

    withOptions(options: string[]): StreamPot;
    withOptions(...options: string[]): StreamPot;

    outputOption(options: string[]): StreamPot;
    outputOption(...options: string[]): StreamPot;

    outputOptions(options: string[]): StreamPot;
    outputOptions(...options: string[]): StreamPot;

    filterGraph(
        spec: string | FilterSpecification | Array<string | FilterSpecification>,
        map?: string[] | string,
    ): StreamPot;

    complexFilter(
        spec: string | FilterSpecification | Array<string | FilterSpecification>,
        map?: string[] | string,
    ): StreamPot;
}
