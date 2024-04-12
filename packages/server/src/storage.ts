import fs from 'fs'

export async function downloadFile(url: string, path: string) {
    try {
        const response = await fetch(url, {
            method: 'GET',
        })
        const buffer = await response.arrayBuffer()
        fs.writeFileSync(path, Buffer.from(buffer))
    }
    catch (err: any) {
        console.log("error downloading file")
        console.log(err)
    }
}
