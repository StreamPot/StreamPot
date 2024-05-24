import fetch from 'cross-fetch';
import { AudioVideoFilter, FilterSpecification } from "./filters";

export type JobStatus = 'pending' | 'completed' | 'failed' | 'uploading'

type Asset = {
    name: string
    url: string
}

type JobEntity = {
    id: number
    status: JobStatus
    assets?: Asset[]
    created_at: string
}

export type StreamPotOptions = {
    secret: string;
    baseUrl?: string;
}

export default class StreamPot {
    protected secret: string;
    protected baseUrl: string;
    protected actions: any[] = [];

    constructor({ secret, baseUrl = 'https://app.streampot.io/api/v1' }: StreamPotOptions) {
        this.secret = secret;
        this.baseUrl = baseUrl;
    }

    public async checkStatus(jobId: string) {
        const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${this.secret}`
            },
        })

        return await response.json()
    }

    public async run(): Promise<JobEntity> {
        const response = await fetch(`${this.baseUrl}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.secret}`
            },
            body: JSON.stringify(this.actions)
        })

        return response.json()
    }

    protected addAction(name: string, ...values: any) {
        this.actions.push({ name, value: values });
    }

    public mergeAdd(source: string) {
        this.addAction('mergeAdd', source);
        return this;
    }

    public addInput(source: string) {
        this.addAction('addInput', source);
        return this;
    }

    public input(source: string) {
        this.addAction('input', source);
        return this;
    }

    public withInputFormat(format: string) {
        this.addAction('withInputFormat', format);
        return this;
    }

    public inputFormat(format: string) {
        this.addAction('inputFormat', format);
        return this;
    }

    public fromFormat(format: string) {
        this.addAction('fromFormat', format);
        return this;
    }

    public withInputFps(fps: number) {
        this.addAction('withInputFps', fps);
        return this;
    }

    public withInputFPS(fps: number) {
        this.addAction('withInputFPS', fps);
        return this;
    }

    public withFpsInput(fps: number) {
        this.addAction('withFpsInput', fps);
        return this;
    }

    public withFPSInput(fps: number) {
        this.addAction('withFPSInput', fps);
        return this;
    }

    public inputFPS(fps: number) {
        this.addAction('inputFPS', fps);
        return this;
    }

    public inputFps(fps: number) {
        this.addAction('inputFps', fps);
        return this;
    }

    public fpsInput(fps: number) {
        this.addAction('fpsInput', fps);
        return this;
    }

    public FPSInput(fps: number) {
        this.addAction('FPSInput', fps);
        return this;
    }

    public nativeFramerate() {
        this.addAction('nativeFramerate');
        return this;
    }

    public withNativeFramerate() {
        this.addAction('withNativeFramerate');
        return this;
    }

    public native() {
        this.addAction('native');
        return this;
    }

    public setStartTime(seek: string | number) {
        this.addAction('setStartTime', seek);
        return this;
    }

    public seekInput(seek: string | number) {
        this.addAction('seekInput', seek);
        return this;
    }

    public loop(duration: string | number | undefined) {
        this.addAction('loop', duration);
        return this;
    }

    public withNoAudio() {
        this.addAction('withNoAudio');
        return this;
    }

    public noAudio() {
        this.addAction('noAudio');
        return this;
    }

    public withAudioCodec(codec: string) {
        this.addAction('withAudioCodec', codec);
        return this;
    }

    public audioCodec(codec: string) {
        this.addAction('audioCodec', codec);
        return this;
    }

    public withAudioBitrate(bitrate: string | number) {
        this.addAction('withAudioBitrate', bitrate);
        return this;
    }

    public audioBitrate(bitrate: string | number) {
        this.addAction('audioBitrate', bitrate);
        return this;
    }

    public withAudioChannels(channels: number) {
        this.addAction('withAudioChannels', channels);
        return this;
    }

    public audioChannels(channels: number) {
        this.addAction('audioChannels', channels);
        return this;
    }

    public withAudioFrequency(freq: number) {
        this.addAction('withAudioFrequency', freq);
        return this;
    }

    public audioFrequency(freq: number) {
        this.addAction('audioFrequency', freq);
        return this;
    }

    public withAudioQuality(quality: number) {
        this.addAction('withAudioQuality', quality);
        return this;
    }

    public audioQuality(quality: number) {
        this.addAction('audioQuality', quality);
        return this;
    }

    public withAudioFilter(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('withAudioFilter', filters);
        return this;
    }

    public withAudioFilters(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('withAudioFilters', filters);
        return this;
    }

    public audioFilter(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('audioFilter', filters);
        return this;
    }

    public audioFilters(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('audioFilters', filters);
        return this;
    }

    public withNoVideo() {
        this.addAction('withNoVideo');
        return this;
    }

    public noVideo() {
        this.addAction('noVideo');
        return this;
    }

    public withVideoCodec(codec: string) {
        this.addAction('withVideoCodec', codec);
        return this;
    }

    public videoCodec(codec: string) {
        this.addAction('videoCodec', codec);
        return this;
    }

    public withVideoBitrate(bitrate: string | number, constant: boolean | undefined) {
        this.addAction('withVideoBitrate', bitrate, constant);
        return this;
    }

    public videoBitrate(bitrate: string | number, constant: boolean | undefined) {
        this.addAction('videoBitrate', bitrate, constant);
        return this;
    }

    public withVideoFilter(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('withVideoFilter', filters);
        return this;
    }

    public withVideoFilters(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('withVideoFilters', filters);
        return this;
    }

    public videoFilter(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('videoFilter', filters);
        return this;
    }

    public videoFilters(filters: string | string[] | AudioVideoFilter[]) {
        this.addAction('videoFilters', filters);
        return this;
    }

    public withOutputFps(fps: number) {
        this.addAction('withOutputFps', fps);
        return this;
    }

    public withOutputFPS(fps: number) {
        this.addAction('withOutputFPS', fps);
        return this;
    }

    public withFpsOutput(fps: number) {
        this.addAction('withFpsOutput', fps);
        return this;
    }

    public withFPSOutput(fps: number) {
        this.addAction('withFPSOutput', fps);
        return this;
    }

    public withFps(fps: number) {
        this.addAction('withFps', fps);
        return this;
    }

    public withFPS(fps: number) {
        this.addAction('withFPS', fps);
        return this;
    }

    public outputFPS(fps: number) {
        this.addAction('outputFPS', fps);
        return this;
    }

    public outputFps(fps: number) {
        this.addAction('outputFps', fps);
        return this;
    }

    public fpsOutput(fps: number) {
        this.addAction('fpsOutput', fps);
        return this;
    }

    public FPSOutput(fps: number) {
        this.addAction('FPSOutput', fps);
        return this;
    }

    public fps(fps: number) {
        this.addAction('fps', fps);
        return this;
    }

    public FPS(fps: number) {
        this.addAction('FPS', fps);
        return this;
    }

    public takeFrames(frames: number) {
        this.addAction('takeFrames', frames);
        return this;
    }

    public withFrames(frames: number) {
        this.addAction('withFrames', frames);
        return this;
    }

    public frames(frames: number) {
        this.addAction('frames', frames);
        return this;
    }

    public keepPixelAspect() {
        this.addAction('keepPixelAspect');
        return this;
    }

    public keepDisplayAspect() {
        this.addAction('keepDisplayAspect');
        return this;
    }

    public keepDisplayAspectRatio() {
        this.addAction('keepDisplayAspectRatio');
        return this;
    }

    public keepDAR() {
        this.addAction('keepDAR');
        return this;
    }

    public withSize(size: string) {
        this.addAction('withSize', size);
        return this;
    }

    public setSize(size: string) {
        this.addAction('setSize', size);
        return this;
    }

    public size(size: string) {
        this.addAction('size', size);
        return this;
    }

    public withAspect(aspect: string | number) {
        this.addAction('withAspect', aspect);
        return this;
    }

    public withAspectRatio(aspect: string | number) {
        this.addAction('withAspectRatio', aspect);
        return this;
    }

    public setAspect(aspect: string | number) {
        this.addAction('setAspect', aspect);
        return this;
    }

    public setAspectRatio(aspect: string | number) {
        this.addAction('setAspectRatio', aspect);
        return this;
    }

    public aspect(aspect: string | number) {
        this.addAction('aspect', aspect);
        return this;
    }

    public aspectRatio(aspect: string | number) {
        this.addAction('aspectRatio', aspect);
        return this;
    }

    public applyAutopadding(pad: boolean | undefined, color: string | undefined) {
        this.addAction('applyAutopadding', pad, color);
        return this;
    }

    public applyAutoPadding(pad: boolean | undefined, color: string | undefined) {
        this.addAction('applyAutoPadding', pad, color);
        return this;
    }

    public applyAutopad(pad: boolean | undefined, color: string | undefined) {
        this.addAction('applyAutopad', pad, color);
        return this;
    }

    public applyAutoPad(pad: boolean | undefined, color: string | undefined) {
        this.addAction('applyAutoPad', pad, color);
        return this;
    }

    public withAutopadding(pad: boolean | undefined, color: string | undefined) {
        this.addAction('withAutopadding', pad, color);
        return this;
    }

    public withAutoPadding(pad: boolean | undefined, color: string | undefined) {
        this.addAction('withAutoPadding', pad, color);
        return this;
    }

    public withAutopad(pad: boolean | undefined, color: string | undefined) {
        this.addAction('withAutopad', pad, color);
        return this;
    }

    public withAutoPad(pad: boolean | undefined, color: string | undefined) {
        this.addAction('withAutoPad', pad, color);
        return this;
    }

    public autoPad(pad: boolean | undefined, color: string | undefined) {
        this.addAction('autoPad', pad, color);
        return this;
    }

    public autopad(pad: boolean | undefined, color: string | undefined) {
        this.addAction('autopad', pad, color);
        return this;
    }

    public addOutput(target: string) {
        this.addAction('addOutput', target);
        return this;
    }

    public output(target: string) {
        this.addAction('output', target);
        return this;
    }

    public seekOutput(seek: string | number) {
        this.addAction('seekOutput', seek);
        return this;
    }

    public seek(seek: string | number) {
        this.addAction('seek', seek);
        return this;
    }

    public withDuration(duration: string | number) {
        this.addAction('withDuration', duration);
        return this;
    }

    public setDuration(duration: string | number) {
        this.addAction('setDuration', duration);
        return this;
    }

    public duration(duration: string | number) {
        this.addAction('duration', duration);
        return this;
    }

    public toFormat(format: string) {
        this.addAction('toFormat', format);
        return this;
    }

    public withOutputFormat(format: string) {
        this.addAction('withOutputFormat', format);
        return this;
    }

    public outputFormat(format: string) {
        this.addAction('outputFormat', format);
        return this;
    }

    public format(format: string) {
        this.addAction('format', format);
        return this;
    }

    public map(spec: string) {
        this.addAction('map', spec);
        return this;
    }

    public updateFlvMetadata() {
        this.addAction('updateFlvMetadata');
        return this;
    }

    public flvmeta() {
        this.addAction('flvmeta');
        return this;
    }

    public addInputOption(...options: string[] | [string[]]) {
        this.addAction('addInputOption', options);
        return this;
    }

    public withInputOption(...options: string[] | [string[]]) {
        this.addAction('withInputOption', options);
        return this;
    }

    public inputOption(...options: string[] | [string[]]) {
        this.addAction('inputOption', options);
        return this;
    }

    public addOutputOption(...options: string[] | [string[]]) {
        this.addAction('addOutputOption', options);
        return this;
    }

    public addOption(...options: string[] | [string[]]) {
        this.addAction('addOption', options);
        return this;
    }

    public withOutputOption(...options: string[] | [string[]]) {
        this.addAction('withOutputOption', options);
        return this;
    }

    public withOption(...options: string[] | [string[]]) {
        this.addAction('withOption', options);
        return this;
    }

    public outputOption(...options: string[] | [string[]]) {
        this.addAction('outputOption', options);
        return this;
    }

    public filterGraph(spec: string | FilterSpecification | (string | FilterSpecification)[], map: string | string[] | undefined) {
        this.addAction('filterGraph', spec, map);
        return this;
    }

    public complexFilter(spec: string | FilterSpecification | (string | FilterSpecification)[], map: string | string[] | undefined) {
        this.addAction('complexFilter', spec, map);
        return this;
    }
}
