import { executeWorkflow, WorkflowAction } from "@/ffmpeg/workflow";
import { JobEntity, JobStatus } from "@/types";
import * as jobsRepository from "../db/jobsRepository";
import {
    deleteEnvironment,
    createEnvironment,
    uploadEnvironment
} from "@/ffmpeg/environment";

export default async function processWorkflow(job: JobEntity) {
    const workflow: WorkflowAction[] = job.payload;

    const executionEnvironment = await createEnvironment();

    try {
        const outcome = await executeWorkflow(workflow, executionEnvironment);

        if (!outcome.success) {
            await jobsRepository.markJobFailed(job.id, outcome.output);
            await deleteEnvironment(executionEnvironment);
            return;
        }

        await jobsRepository.updateJobStatus(job.id, JobStatus.Uploading);

        const assets = await uploadEnvironment(executionEnvironment);
        await jobsRepository.markJobComplete(job.id, assets, outcome.output);
    } catch (error) {
        await jobsRepository.updateJobStatus(job.id, JobStatus.Failed);
        throw error;
    } finally {
        await deleteEnvironment(executionEnvironment);
    }
}
