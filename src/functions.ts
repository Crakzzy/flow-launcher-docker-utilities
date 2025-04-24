import child_process from "child_process";
import {DockerContainer, DockerContainerInfo} from "./types.js";
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

function inspect(containerName: string): string {
    const doesExists = ps().find(container => container.Names === containerName);
    if (!doesExists) {
        return "Container not found";
    } else {
        return child_process.execSync(`docker inspect ${containerName} --format json`).toString();
    }
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

function iterateOverContainerInfo(container: any, response: FlowResponse, parentKey: string = ""): void {
    for (const key in container) {
        if (Object.prototype.hasOwnProperty.call(container, key)) {
            const value = container[key];
            const currentKey = parentKey ? `${parentKey}.${key}` : key;

            if (typeof value === "object" && value !== null) {
                iterateOverContainerInfo(value, response, currentKey);
            } else {
                response.add({
                    title: currentKey,
                    subtitle: String(value),
                });
            }
        }
    }
}

export function getContainerInspectionInfo(params: string[], response: FlowResponse): void {
    if (params.length < 2) {
        response.add({
            title: "Docker inspect",
            subtitle: "Please provide a container name",
        });
        return;
    }

    const containerName: string = params[1];
    const container = inspect(containerName);

    if (container === "Container not found") {
        response.add({
            title: "Docker inspect",
            subtitle: `Container ${containerName} not found`,
        });
        return;
    }
    const containerInfo: DockerContainerInfo = JSON.parse(container)[0];

    // For case with just container name (params.length === 2)
    if (params.length === 2) {
        for (const key in containerInfo) {
            if (Object.prototype.hasOwnProperty.call(containerInfo, key)) {
                const value = containerInfo[key as keyof DockerContainerInfo];
                response.add({
                    title: key,
                    subtitle: String(value),
                    jsonRPCAction: {
                        method: "copy_result",
                        parameters: [value],
                    }
                });
            }
        }
        return;
    }

    // For nested properties (params.length > 2)
    let currentValue: any = containerInfo;
    let currentPath = "";

    for (let i = 2; i < params.length; i++) {
        const key = params[i];
        currentPath = currentPath ? `${currentPath}.${key}` : key;

        if (!currentValue || typeof currentValue !== 'object') {
            response.add({
                title: "Docker inspect",
                subtitle: `Path "${currentPath}" is not valid or not an object`,
            });
            return;
        }

        currentValue = currentValue[key];

        if (currentValue === undefined) {
            response.add({
                title: "Docker inspect",
                subtitle: `Attribute "${key}" not found in path "${currentPath.replace(`.${key}`, '')}"`,
            });
            return;
        }
    }

    if (currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)) {
        for (const key in currentValue) {
            if (Object.prototype.hasOwnProperty.call(currentValue, key)) {
                const value = currentValue[key];
                response.add({
                    title: key,
                    subtitle: String(value),
                    jsonRPCAction: {
                        method: "copy_result",
                        parameters: [value],
                    }
                });
            }
        }
    } else {
        const lastKey = params[params.length - 1];
        response.add({
            title: lastKey,
            subtitle: String(currentValue),
            jsonRPCAction: {
                method: "copy_result",
                parameters: [currentValue],
            }
        });
    }
}

export function copy(content: string) {
    childProcess.spawn("clip").stdin.end(content);
}