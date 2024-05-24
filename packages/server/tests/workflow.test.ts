import { expect, test } from "vitest";
import { toCommandArguments, Workflow } from "../src/ffmpeg/workflow";

test("workflow toCommandArguments", async () => {
    const workflow: Workflow = [
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

    expect(command).toStrictEqual(["-i", "input.mp4", "-y", "output.mp4"])
});
