import child_process from "child_process";
import {DockerContainer} from "./types.js";
import childProcess from "child_process";
import {FlowResponse} from "flow-plugin";

function ps(): DockerContainer[] {
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

export function getRunningContainersInfo(params: string[], response: FlowResponse): void {
    const containers: DockerContainer[] = ps();

    if (containers.length === 0) {
        response.add({
            title: "Docker ps",
            subtitle: "No containers found",
        });
        return;
    }

    if (params.length === 1) {
        containers.forEach(container => {
            response.add({
                title: container.Names,
                subtitle: container.Ports,
                jsonRPCAction: {
                    method: "showExpandedContainerInfo",
                    parameters: [container],
                    dontHideAfterAction: true,
                }
            })
        })
        return;
    }

    if (params.length === 2) {
        const containerName: string = params[1];
        const container: DockerContainer = containers.find(container => container.Names === containerName) as DockerContainer;

        if (!container) {
            response.add({
                title: "Docker ps",
                subtitle: "Container not found",
            });
            return;
        }

        for (const key in container) {
            if (Object.prototype.hasOwnProperty.call(container, key)) {
                const value = container[key as keyof DockerContainer];
                response.add({
                    title: key,
                    subtitle: value,
                    jsonRPCAction: {
                        method: "copy_result",
                        parameters: [value],
                    }
                })
            }
        }
    }
}

export function copy(content: string) {
    childProcess.spawn("clip").stdin.end(content);
}