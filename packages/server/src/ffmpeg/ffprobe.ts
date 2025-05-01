import { spawn } from "child_process";
import { FFprobeResult } from "../types/ffprobe";
import { shouldUseDockerForFFmpeg } from "../config";

export async function executeFFProbe(file: string): Promise<FFprobeResult> {
    try {
        if (shouldUseDockerForFFmpeg()) {
            const args: string[] =
                [
                    'run', '--rm',
                    '--entrypoint', '/usr/local/bin/ffprobe',
                    'linuxserver/ffmpeg',
                    '-v', 'quiet',
                    '-print_format', 'json',
                    '-show_format',
                    '-show_streams',
                    file
                ]

            return new Promise((resolve, reject) => {
                const process = spawn('docker', args, { stdio: 'pipe' });
                let stdout = '';
                let stderr = '';

                process.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                process.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                process.on('close', (code) => {
                    if (code === 0) {
                        const ffprobeResult = JSON.parse(stdout || stderr) as FFprobeResult;
                        resolve(ffprobeResult);
                    } else {
                        reject(stderr || 'Docker execution failed');
                    }
                });
            });
        }

        const metadataOptions = [
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            file
        ];

        return new Promise((resolve, reject) => {
            const process = spawn('ffprobe', metadataOptions, {
                stdio: 'pipe'
            });
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    const ffprobeResult = JSON.parse(stdout || stderr) as FFprobeResult;
                    resolve(ffprobeResult);
                } else {
                    reject(stderr || 'FFProbe execution failed');
                }
            });
        });
    } catch (error) {
        throw error;
    }
}
