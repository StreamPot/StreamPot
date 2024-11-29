export type FfprobeJson = {
    streams: Stream[],
    format: Format,
}

type Stream = {
    index: number,
    codec_name: string,
    codec_long_name: string,
    codec_type: string,
    codec_tag_string: string,
    codec_tag: string,
    sample_fmt?: string,
    sample_rate?: string,
    channels?: number,
    channel_layout?: string,
    bits_per_sample?: number,
    r_frame_rate: string,
    avg_frame_rate: string,
    time_base: string,
    start_pts?: number,
    start_time?: string,
    duration_ts?: number,
    duration?: string,
    bit_rate?: string,
    disposition: {
        default: number,
        dub: number,
        original: number,
        comment: number,
        lyrics: number,
        karaoke: number,
        forced: number,
        hearing_impaired: number,
        visual_impaired: number,
        clean_effects: number,
        attached_pic: number,
        timed_thumbnails: number,
        non_diegetic: number,
        captions: number,
        descriptions: number,
        metadata: number,
        dependent: number,
        still_image: number,
        multilayer: number,
        [key: string]: number
    },
    tags?: Record<string, string>,
}

type Format = {
    filename: string,
    nb_streams: number,
    nb_programs: number,
    nb_stream_groups: number,
    format_name: string,
    format_long_name: string,
    start_time: string,
    duration: string,
    size: string | number,
    bit_rate: string | number,
    probe_score: number,
    tags?: Record<string, string>,
}

export type Metadata = {
    type: 'input' | 'output',
    ffprobeJson: FfprobeJson,
    assetId?: number,
    jobId: number
    size: number
}