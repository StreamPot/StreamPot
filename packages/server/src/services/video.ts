export function trim({
    sourcePath,
    outputPath,
    timeline: { start, end },
}) {
    console.log("trimming video")
    console.log(sourcePath, outputPath, start, end)
    return Promise.resolve()
}