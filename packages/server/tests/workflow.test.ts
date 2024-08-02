import { expect, test } from "vitest";
import { toCommandArguments, WorkflowAction } from "../src/ffmpeg/workflow";

test("workflow toCommandArguments", async () => {
    const workflow: WorkflowAction[] = [
        {
            name: "input",
            value: ["input.mp4"],
        },
        {
            name: "output",
            value: ["output.mp4"],
        },
    ];

    const command = toCommandArguments(workflow);

    expect(command).toStrictEqual(["-hide_banner", "-v", "error", "-i", "input.mp4", "-y", "output.mp4"])
});
