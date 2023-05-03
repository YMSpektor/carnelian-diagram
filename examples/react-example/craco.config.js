const fs = require('fs');
const path = require('path');
const { getLoaders, loaderByName, addBeforeLoader } = require("@craco/craco");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const carnelianDiagramPath = "../../packages/carnelian-diagram/src";
const carnelianInteractionPath = "../../packages/carnelian-interaction/src";
const carnelianShapesPath = "../../packages/carnelian-shapes/src";

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
                ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
            );
            webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

            const {matches} = getLoaders(webpackConfig, loaderByName('babel-loader'));
            addBeforeLoader(webpackConfig, loaderByName('babel-loader'), {
                ...matches[0].loader,
                include: [
                    resolveApp(carnelianDiagramPath),
                    resolveApp(carnelianInteractionPath),
                    resolveApp(carnelianShapesPath)
                ],
            });
            return webpackConfig;
        },
        alias: {
            '@carnelian/diagram': path.resolve(__dirname, carnelianDiagramPath),
            '@carnelian/interaction': path.resolve(__dirname, carnelianInteractionPath),
            '@carnelian/shapes': path.resolve(__dirname, carnelianShapesPath),
        },
    },
};