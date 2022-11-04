import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as taskLib from 'azure-pipelines-task-lib/task';
import * as path from 'path';
import * as semver from 'semver';

export async function getDataTool(versionSpec: string, addToolToPath?: boolean): Promise<string> {

    let toolPath: string;
    taskLib.debug('Trying to get tool from local cache');
    toolPath = toolLib.findLocalTool('cosmosdt', versionSpec);

    if (!toolPath) {
        const version = semver.clean(versionSpec);
        const v = `${semver.major(version)}.${semver.minor(version)}`;
        const url = `https://asgard-web.azureedge.net/devops/dt-${v}.zip`;

        taskLib.debug('Downloading version: ' + url);
        const downloadPath: string = await toolLib.downloadTool(url);

        // Extract
        const extPath = await toolLib.extractZip(downloadPath);
        console.log(extPath);
        toolPath = await toolLib.cacheDir(extPath, 'cosmosdt', versionSpec);
    }

    if (addToolToPath) {
        console.log(taskLib.loc('Info_UsingToolPath', toolPath));
        toolLib.prependPath(toolPath);
    }

    return path.join(toolPath, 'dt.exe');
}