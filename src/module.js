const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const path = require('path');
const { getFileContent } = require('./file');

let MODULE_ID = 0;
function createModuleInfo(filePath) {
    const fileContent = getFileContent(filePath);
    const ast = parser.parse(fileContent, {
        sourceType: 'module',
    });

    const deps = [];
    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            deps.push(node.source.value);
        }
    });

    const { code } = babel.transformFromAstSync(ast, null, {
        presets: ['@babel/preset-env'],
    });

    return {
        id: MODULE_ID++,
        filePath,
        deps,
        code,
    };
}

function createModuleGraph(entry) {
    const moduleInfo = createModuleInfo(entry);
    const moduleGraph = [moduleInfo];
    for(const module of moduleGraph) {
        module.deps.forEach((dep) => {
            module.depMap = {};
            const depPath = path.resolve(path.dirname(module.filePath), dep);
            const depModuleInfo = createModuleInfo(depPath);
            moduleGraph.push(depModuleInfo);
            module.depMap[dep] = depModuleInfo.id;
        });
    }
    return moduleGraph;
}


module.exports = {
    createModuleGraph,
}