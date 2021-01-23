"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassName = exports.invalidFileNames = exports.getLineNoFromString = exports.getArraySchematics = exports.getRelativePathForImport = exports.getCamelCase = exports.getPascalCase = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
function getPascalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.getPascalCase = getPascalCase;
function getCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
exports.getCamelCase = getCamelCase;
function getRelativePathForImport(appModule, importFile) {
    return './' + path_1.relative(path_1.dirname(appModule.path), importFile.path).replace(/\\/g, '/').replace('.ts', '');
}
exports.getRelativePathForImport = getRelativePathForImport;
function getArraySchematics(arrayType) {
    return new RegExp(`${arrayType}(\\s+)?:(\\s+)?\\[`);
}
exports.getArraySchematics = getArraySchematics;
function getLineNoFromString(str, match) {
    const array = str.substring(0, match.index).split('\n');
    const charPosition = str.split('\n')[array.length - 1].indexOf('[');
    return new vscode_1.Position(array.length - 1, charPosition + 1);
}
exports.getLineNoFromString = getLineNoFromString;
exports.invalidFileNames = /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;
function getClassName(fileName) {
    const specialCharIndex = fileName.indexOf('-');
    if (specialCharIndex !== -1) {
        return getPascalCase(fileName.substring(0, specialCharIndex))
            .concat(getPascalCase(fileName.substring(specialCharIndex + 1, fileName.length)));
    }
    else {
        return getPascalCase(fileName);
    }
}
exports.getClassName = getClassName;
//# sourceMappingURL=utils.js.map