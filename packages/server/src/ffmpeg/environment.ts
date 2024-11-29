import { Asset } from "../types";
import fs from "fs/promises";
import { join } from "node:path";
import { v4 as uuidv4 } from "uuid";
import { getPublicUrl, uploadFile } from "../storage";


export interface Environment {
    directory: string
}

export async function createEnvironment() {
    const name = `/tmp/ffmpeg-${uuidv4()}`;

    await fs.mkdir(name, { mode: 0o755 });

    return {
        directory: name
    };
}

export async function uploadEnvironment({ directory }: Environment): Promise<Asset[]> {
    const files = await fs.readdir(directory);

    const uploadPromises = files.map(async (file) => {
        const localFilePath = join(directory, file);
        const remoteFileName = `${uuidv4()}-${file}`;

        await uploadFile({ localFilePath, remoteFileName });

        const url = await getPublicUrl(remoteFileName)

        return <Asset>{ name: file, url, storedPath: remoteFileName };
    });

    const assets = await Promise.all(uploadPromises);

    return assets.filter(asset => asset !== null);
}

export async function deleteEnvironment({ directory }: Environment) {
    await fs.rm(directory, { recursive: true });
}
