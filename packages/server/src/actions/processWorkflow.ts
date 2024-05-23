import { toCommandArguments, Workflow } from "../ffmpeg/workflow";
import { JobEntity, JobStatus } from "../types";
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

async function prepareExecutionEnvironment() {
    const name = `/tmp/ffmpeg-${uuidv4()}`;

    await fs.mkdir(name);
    await fs.chmod(name, 0o755);

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
    const files = await fs.readdir(directory);

    const uploadPromises = files.map(async (file) => {
        const localFilePath = join(directory, file);
        const remoteFileName = `${uuidv4()}-${file}`;

        try {
            await uploadFile({ localFilePath, remoteFileName });
            return <Asset>{ name: file, storedPath: remoteFileName };
        } catch {
            return null;
        }
    });

    const assets = await Promise.all(uploadPromises);

    return assets.filter(asset => asset !== null);
}

