import spawnAsync from "@expo/spawn-async";

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
        const execution = await spawnAsync('ffmpeg', ffmpegArguments, {
            cwd: path,
            stdio: 'pipe',
        });

        // TODO: explore why successful execution responds with stderr
        const output = execution.stdout === '' ? execution.stderr : execution.stdout;

        return { success: true, output };
    } catch (error) {
        return { success: false, output: error.stderr };
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

        const execution = await spawnAsync('docker', args, {
            stdio: 'pipe',
        });

        // Combining stdout and stderr to form the output
        const output = execution.stdout === '' ? execution.stderr : execution.stdout;

        return { success: true, output };
    } catch (error) {
        return { success: false, output: error.stderr || error.message };
    }
}
