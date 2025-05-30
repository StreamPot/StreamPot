import { WorkflowAction } from "./workflow";

export async function ensureInputsAreAccesible(actions: WorkflowAction[]) {
    const inputActions = actions.filter(action => action.name === 'input');

    for (const inputAction of inputActions) {
        for (const inputUrl of inputAction.value) {
            await checkUrlAccessibility(inputUrl);
        }
    }
}

async function checkUrlAccessibility(url: string): Promise<void> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
            throw new Error(`Input "${url}" is not accessible: HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error(`Input "${url}" is not accessible: Network error - Unable to reach URL`);
        }
        throw new Error(`Input "${url}" is not accessible: ${error.message}`);
    }
} 