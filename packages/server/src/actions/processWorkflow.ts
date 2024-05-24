import { toCommandArguments, Workflow } from "../ffmpeg/workflow";
import { Asset, JobEntity, JobStatus } from "../types";
import { executeDocker, executeLocal, ExecutionOutcome } from "../ffmpeg/executionStrategies";
import config from "../config";
import * as jobsRepository from "../db/jobsRepository";
import * as fs from 'fs/promises';
import { join } from 'node:path';
import { uploadFile } from "../storage";
import { v4 as uuidv4 } from 'uuid';

export default async function processWorkflow(job: JobEntity) {
    const workflow: Workflow = job.payload;

    const executionEnvironment = await prepareExecutionEnvironment();
    const outcome = await executeWorkflow(workflow, executionEnvironment.directory);

    if (!outcome.success) {
        await jobsRepository.markJobFailed(job.id, outcome.output);
        await cleanupExecutionEnvironment(executionEnvironment);
        return;
    }

    await jobsRepository.updateJobStatus(job.id, JobStatus.Uploading);

    try {
        const assets = await uploadEnvironment(executionEnvironment);
        await jobsRepository.markJobComplete(job.id, assets, outcome.output);
    } catch (error) {
        await jobsRepository.updateJobStatus(job.id, JobStatus.Failed);
    } finally {
        await cleanupExecutionEnvironment(executionEnvironment);
    }
}

interface ExecutionEnvironment {
    directory: string
}

async function prepareExecutionEnvironment() {
    const name = `/tmp/ffmpeg-${uuidv4()}`;

    await fs.mkdir(name, { mode: 0o755 });

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

async function uploadEnvironment({ directory }: ExecutionEnvironment): Promise<Asset[]> {
    const files = await fs.readdir(directory);

    const uploadPromises = files.map(async (file) => {
        const localFilePath = join(directory, file);
        const remoteFileName = `${uuidv4()}-${file}`;

        await uploadFile({ localFilePath, remoteFileName });

        return <Asset>{ name: file, storedPath: remoteFileName };
    });

    const assets = await Promise.all(uploadPromises);

    return assets.filter(asset => asset !== null);
}

async function cleanupExecutionEnvironment({ directory }: ExecutionEnvironment) {
    await fs.rm(directory, { recursive: true });
}
