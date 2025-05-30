import { spawn } from "child_process";
import { FFprobeResult } from "../types/ffprobe";
import { shouldUseDockerForFFmpeg } from "../config";

const FFPROBE_TIMEOUT_MS = process.env.FFPROBE_TIMEOUT_MS ? Number(process.env.FFPROBE_TIMEOUT_MS) : undefined;

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
                let timeoutId: NodeJS.Timeout | undefined;

                if (FFPROBE_TIMEOUT_MS) {
                    timeoutId = setTimeout(() => {
                        process.kill('SIGTERM');
                        reject(new Error(`FFprobe process timed out after ${FFPROBE_TIMEOUT_MS}ms`));
                    }, FFPROBE_TIMEOUT_MS);
                }

                process.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                process.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                process.on('close', (code) => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    if (code === 0) {
                        const ffprobeResult = JSON.parse(stdout || stderr) as FFprobeResult;
                        resolve(ffprobeResult);
                    } else {
                        reject(stderr || 'Docker execution failed');
                    }
                });

                process.on('error', (error) => {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    reject(error);
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
            let timeoutId: NodeJS.Timeout | undefined;

            if (FFPROBE_TIMEOUT_MS) {
                timeoutId = setTimeout(() => {
                    process.kill('SIGTERM');
                    reject(new Error(`FFprobe process timed out after ${FFPROBE_TIMEOUT_MS}ms`));
                }, FFPROBE_TIMEOUT_MS);
            }

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (code === 0) {
                    const ffprobeResult = JSON.parse(stdout || stderr) as FFprobeResult;
                    resolve(ffprobeResult);
                } else {
                    reject(stderr || 'FFProbe execution failed');
                }
            });

            process.on('error', (error) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                reject(error);
            });
        });
    } catch (error) {
        throw error;
    }
}
