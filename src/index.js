const { createModuleGraph } = require('./module');

/**
 * pack js modules by babel
 * @param {FilePath} entry sinle entry file path
 * @returns bundle js file string
 */
function bundle(entry) {
    const moduleGraph = createModuleGraph(entry);
    const moduleArgs = moduleGraph.map((module) => {
        return `${module.id}: {
            factory: function(exports, require) {
                ${module.code}
            },
            depMap: ${JSON.stringify(module.depMap)}
        }`;
    });

    const iife = `(function(modules){
        const require = function (id) {
            const { factory, depMap } = modules[id];
            const localRequire = requireDepName => require(depMap[requireDepName]);
            const module = { exports: {} };
            factory(module.exports, localRequire);
            return module.exports;
        };
        require(0);

    })({${moduleArgs.join()}});
    `;

    return iife;
}

module.exports = {
    bundle,
}