import { ExecutionContext } from "./ExecutionContext";
import { ExecutionOutcome } from "./ExecutionOutcome";
import spawnAsync from '@expo/spawn-async';

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
