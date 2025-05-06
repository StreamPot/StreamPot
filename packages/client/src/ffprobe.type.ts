/**
 * The "disposition" field on an FFprobe response stream object
 */
export type FFprobeStreamDisposition = {
    /**
     * 1 if the default track
     */
    default: 1 | 0,

    /**
     * 1 if a dub track
     */
    dub: 1 | 0,

    /**
     * 1 if the original track
     */
    original: 1 | 0,

    /**
     * 1 if a comment track
     */
    comment: 1 | 0,

    /**
     * 1 if a lyrics track
     */
    lyrics: 1 | 0,

    /**
     * 1 if a karaoke track
     */
    karaoke: 1 | 0,

    /**
     * 1 if a forced track
     */
    forced: 1 | 0,

    /**
     * 1 if a track for the hearing impaired
     */
    hearing_impaired: 1 | 0,

    /**
     * 1 if a track for the visually impaired
     */
    visual_impaired: 1 | 0,

    /**
     * 1 if a clean effects track
     */
    clean_effects: 1 | 0,

    /**
     * 1 if an attached picture track
     */
    attached_pic: 1 | 0,

    /**
     * 1 if a timed thumbnails track (perhaps like the preview thumbnails you get when scrolling over a YouTube video's seek bar)
     */
    timed_thumbnails: 1 | 0,

    /**
     * 1 if a captions track
     */
    captions: 1 | 0,

    /**
     * 1 if a descriptions track
     */
    descriptions: 1 | 0,

    /**
     * 1 if a metadata track
     */
    metadata: 1 | 0,

    /**
     * 1 if a dependent track (unclear meaning)
     */
    dependent: 1 | 0,

    /**
     * 1 if a still image track
     */
    still_image: 1 | 0

    /**
     * 1 if a non-diegetic track.From chatgpt: “non-diegetic” channels are simply extra channels appended to an ambisonic layout that aren’t part of the spatial (diegetic) Ambisonics signal itself. In other words, when you use an AMBISONIC channel order, you can tack on additional stereo or other channels (for things like a music bed, narration, etc., that exist outside the 3D scene). Those extras are flagged as “non-diegetic” so that functions like av_channel_layout_ambisonic_order() know to ignore them when determining the true Ambisonic orde
     */
    non_diegetic: 1 | 0

    /**
     * 1 if a multilayer track
     */
    multilayer: 1 | 0
}

/**
 * The "tags" field on an FFprobe response stream object
 */
export type FFprobeStreamTags = {
    /**
     * The track's language (usually represented using a 3 letter language code, e.g.: "eng")
     */
    language?: string,

    /**
     * The name of the handler which produced the track
     */
    handler_name?: string,

    /**
     * The timecode of the stream
     */
    timecode?: string,

    /**
     * The ID of the vendor which produced the track
     */
    vendor_id?: string,

    /**
     * The name of the encoder responsible for creating the stream
     */
    encoder?: string,

    /**
     * The date (often ISO-formatted, but it may use other formats) when the media was created
     */
    creation_time?: string,

    /**
     * The comment attached to the stream
     */
    comment?: string
}

/**
 * An FFprobe response stream object
 */
export type FFprobeStream = {
    /**
     * The stream ID. 
     */
    id?: string,

    /**
     * The stream index
     */
    index: number,

    /**
     * The codec's name
     */
    codec_name?: string,

    /**
     * The codec's long (detailed) name
     */
    codec_long_name?: string,

    /**
     * The codec type
     */

    /**
     * The codec profile
     */
    profile?: string,

    /**
     * The type of codec (video, audio, subtitle, etc.)
     */
    codec_type: 'video' | 'audio' | 'subtitle' | 'data',

    /**
     * The codec tag (technical name)
     */
    codec_tag_string: string,

    /**
     * The codec tag ID
     */
    codec_tag: string,

    /**
     * The audio sample format (not present if codec_type is not "audio")
     */
    sample_fmt?: string,

    /**
     * A string representation of an integer showing the audio sample rate (not present if codec_type is not "audio")
     */
    sample_rate?: string,

    /**
     * The audio track's channel count (not present if codec_type is not "audio")
     */
    channels?: number,

    /**
     * The audio track's channel layout (e.g. "stereo") (not present if codec_type is not "audio")
     */
    channel_layout?: string,

    /**
     * Bits per audio sample (might not be accurate, may just be 0) (not present if codec_type is not "audio")
     */
    bits_per_sample?: number,

    /**
     * The video stream width (also available for images) (not present if codec_type is not "video")
     */
    width?: number,

    /**
     * The stream height (also available for images) (not present if codec_type is not "video")
     */
    height?: number,

    /**
     * The stream's coded width (shouldn't vary from "width") (not present if codec_type is not "video")
     */
    coded_width?: number,

    /**
     * The stream's coded height (shouldn't vary from "height") (not present if codec_type is not "video")
     */
    coded_height?: number,

    /**
     * Set to 1 if closed captions are present in stream... I think (not present if codec_type is not "video")
     */
    closed_captions?: 1 | 0 | number,

    /**
     * Set to 1 if the stream has b-frames... I think (not present if codec_type is not "video")
     */
    has_b_frames?: 1 | 0 | number,

    /**
     * Set to 1 if the stream has film grain (not present if codec_type is not "video")
     */
    film_grain?: 1 | 0 | number,

    /**
     * The sample aspect ratio (you probably want "display_aspect_ratio") (not present if codec_type is not "video")
     */
    sample_aspect_ratio?: string,

    /**
     * The display (real) aspect ratio (e.g. "16:9") (not present if codec_type is not "video")
     */
    display_aspect_ratio?: string,

    /**
     * The pixel format used (not present if codec_type is not "video")
     */
    pix_fmt?: string,

    /**
     * Unknown (not present if codec_type is not "video")
     */
    level?: number,

    /**
     * The color range used (e.g. "tv") (not present if codec_type is not "video")
     */
    color_range?: string,

    /**
     * The color space used (not present if codec_type is not "video")
     */
    color_space?: string,

    /**
     * The color transfer used (not present if codec_type is not "video")
     */
    color_transfer?: string,

    /**
     * The color primaries used (not present if codec_type is not "video")
     */
    color_primaries?: string,

    /**
     * The chroma location (not present if codec_type is not "video")
     */
    chroma_location?: string,

    /**
     * The field order (not present if codec_type is not "video")
     */
    field_order?: string,

    /**
     * Unknown (not present if codec_type is not "video")
     */
    refs?: number,

    /**
     * Whether the stream is AVC (not present if codec_type is not "video")
     */
    is_avc?: 'true' | 'false',

    /**
     * Unknown string representing a number (not present if codec_type is not "video")
     */
    nal_length_size?: string,

    /**
     * Odd formatting of the frame rate, possibly "real frame rate"? (e.g. "30/1")
     */
    r_frame_rate: string,

    /**
     * Odd formatting of the average frame rate (e.g. "30/1")
     */
    avg_frame_rate: string,

    /**
     * The division equation to use for converting integer representations of timestamps into seconds (e.g. "1/30000" turns 80632552 into 2687.751733 seconds)
     */
    time_base: string,

    /**
     * Unknown
     */
    start_pts?: number,

    /**
     * A string representation of a floating point integer showing the start time in seconds
     */
    start_time?: string,

    /**
     * The stream's duration in integer timestamp format (defined by time_base)
     */
    duration_ts?: number,

    /**
     * A string representation of a floating point integer showing the stream duration in seconds
     */
    duration?: string,

    /**
     * The string representation of an integer showing the stream bit rate (not present on lossless formats such as FLAC)
     */
    bit_rate?: string,

    /**
     * A string representation of an integer showing the bits per raw sample (not present if codec_type is not "video")
     */
    bits_per_raw_sample?: string,

    /**
     * A string representation of an integer showing the total number of frames in the stream
     */
    nb_frames?: string,

    /**
     * The size of the extradata
     */
    extradata_size?: number,

    /**
     * The stream's disposition
     */
    disposition: FFprobeStreamDisposition,

    /**
     * The stream's tags
     */
    tags?: FFprobeStreamTags

    /**
     * The initial padding
     */
    initial_padding?: number
}

/**
 * The "tags" field on an FFprobe response chapter object
 */
export type FFprobeChapterTags = {
    /**
     * The chapter title
     */
    title: string
}

/**
 * An FFprobe response chapter object
 */
export type FFprobeChapter = {
    /**
     * The chapter ID
     */
    id: number,

    /**
     * The division equation to use for converting integer representations of timestamps into seconds (e.g. "1/30000" turns 80632552 into 2687.751733 seconds)
     */
    time_base: string,

    /**
     * When the chapter starts in integer timestamp format (defined by time_base)
     */
    start: number,

    /**
     * The string representation of a floating point integer showing when the chapter starts in seconds
     */
    start_time: string,

    /**
     * When the chapter end in integer timestamp format (defined by time_base)
     */
    end: number,

    /**
     * The string representation of a floating point integer showing when the chapter ends in seconds
     */
    end_time: string,

    /**
     * The chapter's tags
     */
    tags: FFprobeChapterTags
}

/**
 * The "tags" field on an FFprobe response format object
 */

export type FFprobeFormatTags = Record<string, string>
/** 
 * Many that would be missed if specified individually e.g. com.apple.proapps.mediaIdentifier
 * 
 */

/**
 * An FFprobe response format object
 */
export type FFprobeFormat = {
    /**
     * The path of the probed file (as specified in the input file argument)
     */
    filename: string,

    /**
     * The total number of streams present
     */
    nb_streams: number,

    /**
     * The total number of programs present
     */
    nb_programs: number,

    /**
     * The name of the format (a comma separated list of applicable file extensions for the format)
     */
    format_name: string,

    /**
     * The long (detailed) name of the format
     */
    format_long_name: string,

    /**
     * The string representation of a floating point integer showing the file's starting time
     */
    start_time?: string,

    /**
     * The string representation of a floating point integer showing the file's duration in seconds (seems to be a non-accurate, rounded version of the real duration)
     */
    duration?: string,

    /**
     * The string representation of a long integer showing the file's size in bytes
     */
    size: string,

    /**
     * The string representation of a long integer showing the file's stated bitrate (may vary between streams, probably applies to just video if a video file)
     */
    bit_rate?: string,

    /**
     * A score of how confident FFprobe is of the format, 0 to 100. https://stackoverflow.com/questions/25257986/what-does-probe-score-mean-in-ffprobe-output
     */
    probe_score: number,

    /**
     * The total number of stream groups present
    */
    nb_stream_groups?: number,

    /**
     * The format's tags
     */
    tags?: FFprobeFormatTags
}

/**
 * An FFprobe error object
 */
export type FFprobeProbeError = {
    /**
     * The error code
     */
    code: number,

    /**
     * The error message
     */
    string: string
}

/**
 * An FFprobe probe result object
 */
export type FFprobeResult = {
    /**
     * The probed file's streams (-show_streams flag required)
     */
    streams?: FFprobeStream[],

    /**
     * The probed file's chapters (-show_chapters flag required)
     */
    chapters?: FFprobeChapter[],

    /**
     * The probed file's format data (-show_format flag required)
     */
    format?: FFprobeFormat,

    /**
     * The error that occurred when trying to probe the file (-show_error flag required)
     */
    error?: FFprobeProbeError
}