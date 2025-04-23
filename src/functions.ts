import child_process from "child_process";
import {DockerContainer} from "./types.js";
import childProcess from "child_process";

export function ps(): DockerContainer[] {
    const rawContainer = child_process.execSync("docker ps --format json").toString().split("\n");

    return rawContainer.map((container, index) => {
        if (index !== rawContainer.length - 1) {
            try {
                return JSON.parse(container);
            } catch (error) {
                return null;
            }
        }
    });
}

export function copy(content: string) {
    childProcess.spawn("clip").stdin.end(content);
}