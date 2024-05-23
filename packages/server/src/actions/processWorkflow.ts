import { toCommandArguments, Workflow } from "../ffmpeg/workflow";
import { JobEntity } from "../types";
import * as fs from 'fs';
import { executeDocker, executeLocal, ExecutionOutcome } from "../ffmpeg/executionStrategies";
import config from "../config";

export default async function processWorkflow(job: JobEntity) {
    const workflow: Workflow = job.payload;

    const executionEnvironment = prepareExecutionEnvironment();
    const outcome = await executeWorkflow(workflow, executionEnvironment.directory);

    console.log(outcome)

    
}

function prepareExecutionEnvironment(): { directory: string } {
    const name = "/tmp/ffmpeg-" + Math.random().toString(36).substring(7);

    fs.mkdirSync(name);

    fs.chmodSync(name, 0o755);

    return { directory: name };
}

async function executeWorkflow(workflow: Workflow, directory: string): Promise<ExecutionOutcome> {
    const ffmpegArguments = toCommandArguments(workflow);

    if (config.ffmpegStrategy === 'docker') {
        return await executeDocker({ ffmpegArguments, path: directory });
    }

    return await executeLocal({ ffmpegArguments, path: directory });
}

async
