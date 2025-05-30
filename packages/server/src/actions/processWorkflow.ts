import { executeWorkflow, WorkflowAction } from "../ffmpeg/workflow";
import { shouldCollectAssetMetadata } from "../config";
import { generateMetadata } from "../metadata";
import { JobEntity, JobStatus } from "../types";
import { markJobComplete, markJobFailed, updateJobStatus, addAssets } from "../db";
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
            await markJobFailed(job.id, outcome.output);
            return;
        }

        await updateJobStatus(job.id, JobStatus.Uploading);

        const assets = await uploadAssets(executionEnvironment);
        const savedAssets = (await addAssets(job, assets))

        if (shouldCollectAssetMetadata()) {
            await updateJobStatus(job.id, JobStatus.GeneratingMetadata);
            await generateMetadata(job, savedAssets, startTime);
        }

        await markJobComplete(job.id, outcome.output);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        await markJobFailed(job.id, errorMessage);
    } finally {
        await deleteEnvironment(executionEnvironment);
    }
}