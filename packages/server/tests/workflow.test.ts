import { expect, test } from "vitest";
import { toCommand } from "../src/ffmpeg/workflow";

test("workflow toCommand", async () => {
    const workflow = [
        {
            name: "input",
            value: ["input.mp4"],
        },
        {
            name: "output",
            value: ["output.mp4"],
        },
    ];

    const command = toCommand(workflow);

    expect(command).toBe("-i input.mp4 -y output.mp4");
});
