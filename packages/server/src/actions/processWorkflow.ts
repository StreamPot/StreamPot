import { executeWorkflow, WorkflowAction } from "../ffmpeg/workflow";
import { shouldCollectAssetMetadata } from "../config";
import { generateMetadata } from "../metadata";
import { JobEntity, JobStatus } from "../types";
import * as jobsRepository from "../db/jobsRepository";
import {
    deleteEnvironment,
    createEnvironment,
    uploadAssets
} from "../ffmpeg/environment";

export default async function processWorkflow(job: JobEntity) {
    const workflow: WorkflowAction[] = job.payload;

    const executionEnvironment = await createEnvironment();

    try {
        const startTime = Date.now();
        const outcome = await executeWorkflow(workflow, executionEnvironment);

        if (!outcome.success) {
            await jobsRepository.markJobFailed(job.id, outcome.output);
            return;
        }

        await jobsRepository.updateJobStatus(job.id, JobStatus.Uploading);

        const assets = await uploadAssets(executionEnvironment);
        const savedAssets = (await jobsRepository.addAssets(job, assets))

        if (shouldCollectAssetMetadata()) {
            await jobsRepository.updateJobStatus(job.id, JobStatus.GeneratingMetadata);
            await generateMetadata(job, savedAssets, startTime);
        }

        await jobsRepository.markJobComplete(job.id, outcome.output);
    } catch (error) {
        await jobsRepository.updateJobStatus(job.id, JobStatus.Failed);
        throw error;
    } finally {
        await deleteEnvironment(executionEnvironment);
    }
}