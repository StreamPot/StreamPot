import fs from 'fs'

export async function downloadFile(url: string, path: string) {
    console.log("downloading file")
    console.log(url, path)
    const response = await fetch(url, {
        method: 'GET',
    })
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(path, Buffer.from(buffer))
}
