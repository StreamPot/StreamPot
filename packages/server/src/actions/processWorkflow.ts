import { toCommandArguments, Workflow } from "../ffmpeg/workflow";
import { JobEntity, JobStatus } from "../types";
import * as fs from 'fs';
import { executeDocker, executeLocal, ExecutionOutcome } from "../ffmpeg/executionStrategies";
import config from "../config";
import * as jobsRepository from "../db/jobsRepository";

export default async function processWorkflow(job: JobEntity) {
    const workflow: Workflow = job.payload;

    const executionEnvironment = prepareExecutionEnvironment();
    const outcome = await executeWorkflow(workflow, executionEnvironment.directory);

    if (!outcome.success) {
        await jobsRepository.updateJobStatus(job.id, JobStatus.Failed);
        return;
    }

    await jobsRepository.updateJobStatus(job.id, JobStatus.Uploading);

    const assets = await uploadEnvironment(executionEnvironment);

    await jobsRepository.markJobComplete(job.id, assets);
}

interface ExecutionEnvironment {
    directory: string
}

function prepareExecutionEnvironment(): ExecutionEnvironment {
    const name = "/tmp/ffmpeg-" + Math.random().toString(36).substring(7);

    fs.mkdirSync(name);

    fs.chmodSync(name, 0o755);

    return {
        directory: name
    };
}

async function executeWorkflow(workflow: Workflow, directory: string): Promise<ExecutionOutcome> {
    const ffmpegArguments = toCommandArguments(workflow);

    if (config.ffmpegStrategy === 'docker') {
        return await executeDocker({ ffmpegArguments, path: directory });
    }

    return await executeLocal({ ffmpegArguments, path: directory });
}

interface Asset {
    name: string
    storedPath: string
}

async function uploadEnvironment({ directory }: ExecutionEnvironment): Promise<Asset[]> {
    console.log('uploading', directory)

    return [];
}
