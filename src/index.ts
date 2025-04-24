import {Flow} from "flow-plugin";
import {DockerContainer} from "./types.js";
import {copy, getContainerInspectionInfo, getRunningContainersInfo} from "./functions.js";

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
                    getRunningContainersInfo(params, response);
                    break;
                }
                case "inspect" : {
                    getContainerInspectionInfo(params, response);
                    break;
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

flow.on("goToNestedAttribute", ({parameters}, response) => {
    const containerName = parameters[0];
    const keys = parameters.slice(1);

    const query = `d inspect ${containerName} ${keys.join(' ')}`;
    response.changeQuery(query);
});

flow.on("copy_result", ({parameters}) => {
    copy(parameters.toString());
});