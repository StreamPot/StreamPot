import fluentFfmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import { executeDocker, executeLocal, ExecutionOutcome } from "./execution";
import methodList from './fluent-ffmpeg-methods.json' assert { type: 'json' };

/**
 * A list of allowed methods that can be called on the ffmpeg instance.
 */
const methods = methodList as (keyof FfmpegCommand)[];

export interface WorkflowAction {
    name: string,
    value: string[]
}

/**
 * Uses fluent-ffmpeg to build the ffmpeg arguments array from a workflow.
 */
export function toCommandArguments(actions: WorkflowAction[]): string[] {
    const ffmpegInstance = fluentFfmpeg()

    for (const action of actions) {
        if ((methods as string[]).includes(action.name)) {
            ffmpegInstance[action.name](...action.value)
        }
    }

    return ['-hide_banner', '-v', 'error', ...ffmpegInstance._getArguments()];
}

export async function executeWorkflow(actions: WorkflowAction[], directory: string): Promise<ExecutionOutcome> {
    const ffmpegArguments = toCommandArguments(actions);

    if (process.env.FFMPEG_STRATEGY === 'docker') {
        return await executeDocker({ ffmpegArguments, path: directory });
    }

    return await executeLocal({ ffmpegArguments, path: directory });
}

