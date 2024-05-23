import { ExecutionContext } from "./ExecutionContext";
import { ExecutionOutcome } from "./ExecutionOutcome";
import spawnAsync from '@expo/spawn-async';

export async function executeLocal({ ffmpegArguments, path }: ExecutionContext): Promise<ExecutionOutcome> {
    try {
        const execution = await spawnAsync('ffmpeg', ffmpegArguments, {
            cwd: path,
            stdio: 'pipe',
        });

        return {
            success: true,
            // TODO: explore why successful execution responds with stderr
            output: execution.stdout === '' ? execution.stderr : execution.stdout,
        }
    } catch (error) {
        return {
            success: false,
            output: error.stderr,
        }
    }
}
