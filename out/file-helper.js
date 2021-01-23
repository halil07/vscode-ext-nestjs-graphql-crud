"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeneratedFile = exports.getFileTemplate = exports.getFileTemplates = exports.createFiles = void 0;
const vscode_1 = require("vscode");
const mustache_1 = require("mustache");
const utils_1 = require("./utils");
const fs = require("fs-extra");
const path_1 = require("path");
const util_1 = require("util");
function createFiles(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(path_1.join(file.uri.fsPath, file.name.toLowerCase() + `.${file.type}.ts`))) {
            return vscode_1.window.showErrorMessage("A file already exists with given name");
        }
        else {
            const stats = yield vscode_1.workspace.fs.stat(file.uri);
            if (stats.type !== vscode_1.FileType.Directory) {
                return vscode_1.window.showErrorMessage("Should be Directory");
            }
            const generatedFiles = yield getFileTemplates(file);
            generatedFiles.forEach((f) => f.then((a) => createGeneratedFile(a)));
        }
    });
}
exports.createFiles = createFiles;
function getFileTemplates(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const typeList = JSON.parse(yield fs.readFileSync(path_1.join(__dirname, `./templates/generateGraphQL.json`), "utf8"));
        const terminal = vscode_1.window.createTerminal(`NestJS Terminal #1 will close`);
        terminal.sendText(`nest generate module ${file.name}`);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield getFileTemplate(file, "module").then((a) => createGeneratedFile(a));
            terminal.dispose();
        }), 3000);
        return typeList.map((type) => __awaiter(this, void 0, void 0, function* () { return yield getFileTemplate(file, type); }));
    });
}
exports.getFileTemplates = getFileTemplates;
function getFileTemplate(file, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs
            .readFile(path_1.join(__dirname, `/templates/${file.type}/${type}.mustache`), "utf8")
            .then((data) => {
            const nameUpper = utils_1.getClassName(file.name);
            const nameLower = file.name.toLowerCase();
            return mustache_1.render(data, {
                nameUpper,
                nameLower,
            });
        })
            .then((data) => ({
            text: data.toString(),
            name: file.name,
            fileName: `${file.name}.${type}.ts`,
            uri: file.uri,
        }));
    });
}
exports.getFileTemplate = getFileTemplate;
function createGeneratedFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_1.workspace.fs.writeFile(vscode_1.Uri.parse(file.uri + "/" + file.name + "/" + file.fileName), new util_1.TextEncoder().encode(file.text));
    });
}
exports.createGeneratedFile = createGeneratedFile;
//# sourceMappingURL=file-helper.js.map