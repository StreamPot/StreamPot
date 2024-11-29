import spawnAsync from "@expo/spawn-async";
import { join } from "node:path";
import { FfprobeJson, Metadata } from "../types/metadata";
import { executeWorkflow, WorkflowAction } from "../ffmpeg/workflow";
import { JobEntity, JobStatus } from "../types";
import * as jobsRepository from "../db/jobsRepository";
import {
    deleteEnvironment,
    createEnvironment,
    uploadEnvironment
} from "../ffmpeg/environment";

export default async function processWorkflow(job: JobEntity) {
    const workflow: WorkflowAction[] = job.payload;
    const executionEnvironment = await createEnvironment();
    let allMetadata: Metadata[] = [];

    try {
        const outcome = await executeWorkflow(workflow, executionEnvironment);
        
        const inputMetadata = await collectInputMetadata(workflow, executionEnvironment.directory, job.id);
        allMetadata = inputMetadata;

        if (!outcome.success) {
            await jobsRepository.markJobFailed(job.id, outcome.output);
            return;
        }

        await jobsRepository.updateJobStatus(job.id, JobStatus.Uploading);

        const assets = await uploadEnvironment(executionEnvironment);
        const outputMetadata = await Promise.all(
            assets.map(asset => collectAssetMetadata(asset.name, executionEnvironment.directory, job.id))
        );
        
        const assetRecords = await jobsRepository.markJobComplete(job.id, assets, outcome.output);
        
        outputMetadata.forEach((meta, index) => {
            meta.assetId = assetRecords[index].id;
            allMetadata.push(meta);
        });
    } catch (error) {
        await jobsRepository.updateJobStatus(job.id, JobStatus.Failed);
        throw error;
    } finally {
        await deleteEnvironment(executionEnvironment);
        console.log("allMetadata", allMetadata);
        await jobsRepository.saveMetadata(allMetadata);
        console.log("saved metadata");
    }
}

async function collectAssetMetadata(
    file: string,
    directory: string,
    jobId: number
): Promise<Metadata> {
    const ffprobeResponse = await runFfprobeAnalysis(file, directory);
    const ffprobeJson = JSON.parse(ffprobeResponse) as FfprobeJson;

    return {
        type: 'output',
        ffprobeJson,
        assetId: undefined,
        jobId,
        size: Number(ffprobeJson.format.size)
    };
}

async function collectInputMetadata(
    workflow: WorkflowAction[], 
    directory: string, 
    jobId: number
): Promise<Metadata[]> {
    const inputs = workflow.filter(action => action.name === 'input');
    
    return Promise.all(inputs.map(async input => {
        const ffprobeResponse = await runFfprobeAnalysis(input.value[0], directory, true);
        const ffprobeJson = JSON.parse(ffprobeResponse) as FfprobeJson;
        
        return {
            type: 'input',
            ffprobeJson,
            assetId: null,
            jobId,
            size: Number(ffprobeJson.format.size)
        };
    }));
}

async function runFfprobeAnalysis(file: string, directory: string, remoteUrl = false): Promise<string> {
    if (process.env.FFMPEG_STRATEGY === 'docker') {
        const args: string[] = remoteUrl ? 
        [
            'run', '--rm',
            '--entrypoint', '/usr/local/bin/ffprobe',
            'linuxserver/ffmpeg',
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            file
        ]
        :[
            'run', '--rm',
            '-v', `${directory}:/work`,
            '-w', '/work',
            '--entrypoint', '/usr/local/bin/ffprobe',
            'linuxserver/ffmpeg',
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            join('/work', file)
        ];

        const execution = await spawnAsync('docker', args, {
            stdio: 'pipe',
        });
        return execution.stdout === '' ? execution.stderr : execution.stdout;
    }
    const metadataOptions = [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        file
    ]
    const execution = await spawnAsync('ffprobe', metadataOptions, {
        cwd: directory,
        stdio: 'pipe',
    });
    return execution.stdout === '' ? execution.stderr : execution.stdout;
}