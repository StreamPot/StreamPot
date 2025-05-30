import fluentFfmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { executeDocker, executeLocal, ExecutionOutcome } from "./execution";
import methodList from "./fluent-ffmpeg-methods.json" assert { type: "json" };
import { Environment } from "./environment";
import { shouldUseDockerForFFmpeg } from "../config";
import { ensureInputsAreAccesible } from "./validation";

const methods = methodList as (keyof FfmpegCommand)[];

export interface WorkflowAction {
    name: string;
    value: string[];
}

export function toCommandArguments(actions: WorkflowAction[]): string[] {
    const ffmpegInstance = fluentFfmpeg();

    for (const action of actions) {
        if ((methods as string[]).includes(action.name)) {
            try {
                // @ts-expect-error
                ffmpegInstance[action.name](...action.value);
            } catch (err) {
                throw new Error(`Failed to apply FFmpeg method '${action.name}': ${(err as Error).message}`);
            }
        } else {
            throw new Error(`Invalid FFmpeg method: '${action.name}'`);
        }
    }

    return ["-hide_banner", "-v", "error", ...ffmpegInstance._getArguments()];
}

export async function executeWorkflow(
    actions: WorkflowAction[],
    environment: Environment
): Promise<ExecutionOutcome> {
    await ensureInputsAreAccesible(actions);

    const ffmpegArguments = toCommandArguments(actions);

    if (shouldUseDockerForFFmpeg()) {
        return await executeDocker({ ffmpegArguments, path: environment.directory });
    }

    return await executeLocal({ ffmpegArguments, path: environment.directory });
}