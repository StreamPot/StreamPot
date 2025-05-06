import fluentFfmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import { executeDocker, executeLocal, ExecutionOutcome } from "./execution";
import methodList from './fluent-ffmpeg-methods.json' assert { type: 'json' };
import { Environment } from "./environment";
import { shouldUseDockerForFFmpeg } from '../config';

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

export async function executeWorkflow(actions: WorkflowAction[], environment: Environment): Promise<ExecutionOutcome> {
    const ffmpegArguments = toCommandArguments(actions);

    if (shouldUseDockerForFFmpeg()) {
        return await executeDocker({ ffmpegArguments, path: environment.directory });
    }

    return await executeLocal({ ffmpegArguments, path: environment.directory });
}

