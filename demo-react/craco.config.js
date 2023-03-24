const path = require('path');

module.exports = {
    webpack: {
        configure: webpackConfig => {
            const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
                ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
            );
      
            webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
            return webpackConfig;
        },
        alias: {
            'carnelian-diagram': path.resolve(__dirname, '../carnelian-diagram/dist'),
        },
    },
};