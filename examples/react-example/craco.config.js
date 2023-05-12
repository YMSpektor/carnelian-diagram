const fs = require('fs');
const path = require('path');
const { getLoaders, loaderByName, addBeforeLoader } = require("@craco/craco");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const carnelianCorePath = "../../packages/core/src";
const carnelianInteractionPath = "../../packages/interaction/src";
const carnelianShapesPath = "../../packages/shapes/src";

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
                    resolveApp(carnelianCorePath),
                    resolveApp(carnelianInteractionPath),
                    resolveApp(carnelianShapesPath)
                ],
            });
            return webpackConfig;
        },
        alias: {
            '@carnelian-diagram/core': path.resolve(__dirname, carnelianCorePath),
            '@carnelian-diagram/interaction': path.resolve(__dirname, carnelianInteractionPath),
            '@carnelian-diagram/shapes': path.resolve(__dirname, carnelianShapesPath),
        },
    },
};