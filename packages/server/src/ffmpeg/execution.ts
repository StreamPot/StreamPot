import spawnAsync from "@expo/spawn-async";

const FFMPEG_TIMEOUT_MS = process.env.FFMPEG_TIMEOUT_MS ? Number(process.env.FFMPEG_TIMEOUT_MS) : undefined;

export interface ExecutionContext {
    ffmpegArguments: string[]
    path: string
}

export interface ExecutionOutcome {
    success: boolean
    output?: string
}

export async function executeLocal({ ffmpegArguments, path }: ExecutionContext): Promise<ExecutionOutcome> {
    try {
        const spawnOptions: any = {
            cwd: path,
            stdio: 'pipe',
        };

        if (FFMPEG_TIMEOUT_MS) {
            spawnOptions.timeout = FFMPEG_TIMEOUT_MS;
        }

        const execution = await spawnAsync('ffmpeg', ffmpegArguments, spawnOptions);

        // TODO: explore why successful execution responds with stderr
        const output = execution.stdout === '' ? execution.stderr : execution.stdout;

        return { success: true, output };
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            return { success: false, output: `Process timed out after ${FFMPEG_TIMEOUT_MS}ms` };
        }
        return { success: false, output: error.stderr || error.message };
    }
}

export async function executeDocker({ ffmpegArguments, path }: ExecutionContext): Promise<ExecutionOutcome> {
    try {
        const args: string[] = [
            'run', '--rm',
            '-v', `${path}:/work`,
            '-w', '/work',
            'linuxserver/ffmpeg',
            ...ffmpegArguments
        ];

        const spawnOptions: any = {
            stdio: 'pipe',
        };

        if (FFMPEG_TIMEOUT_MS) {
            spawnOptions.timeout = FFMPEG_TIMEOUT_MS;
        }

        const execution = await spawnAsync('docker', args, spawnOptions);

        // Combining stdout and stderr to form the output
        const output = execution.stdout === '' ? execution.stderr : execution.stdout;

        return { success: true, output };
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            return { success: false, output: `Process timed out after ${FFMPEG_TIMEOUT_MS}ms` };
        }
        return { success: false, output: error.stderr || error.message };
    }
}
