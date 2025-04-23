import {Flow} from "flow-plugin";
import {copy, ps} from "./functions.js";
import {DockerContainer} from "./types.js";

const flow = new Flow({keepOrder: true, icon: "./icon.png"});


flow.on("query", ({prompt}, response) => {

        if (!prompt || prompt.trim() === '') {
            response.add({
                title: "Docker Utilities",
                subtitle: "Enter a Docker command",
            });
            return;
        }

        const params: string[] = prompt.split(" ");

        try {
            switch (params[0]) {
                case "ps": {
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
                        break;
                    }
                }
            }
        } catch (error) {
        }
    }
)

flow.on("showExpandedContainerInfo", ({parameters}, response) => {
    const container: DockerContainer = parameters[0] as DockerContainer;
    response.changeQuery(`d ps ${container.Names}`);
})

flow.on("copy_result", ({parameters}) => {
    copy(parameters.toString());
});