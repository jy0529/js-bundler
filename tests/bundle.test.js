const path = require('path');
const { bundle } = require('../src/index');

eval(bundle(path.resolve(__dirname, './entry.js')))