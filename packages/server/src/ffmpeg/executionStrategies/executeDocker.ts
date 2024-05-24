import { ExecutionContext } from "./ExecutionContext";
import { ExecutionOutcome } from "./ExecutionOutcome";
import spawnAsync from '@expo/spawn-async';

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
